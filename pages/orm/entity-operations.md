---
title: Операции с сущностями
description: 'Операции с сущностями. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Сущности позволяют взаимодействовать с базой данных, выполняя основные операции: добавление, изменение и удаление записи. Этот подход упрощает работу с данными и обеспечивает их целостность и безопасность.

## Основные операции

Для модификации данных в БД можно использовать три ключевых метода: `add`, `update`, `delete`. Рассмотрим их на примера класса `BookTable`.

### Метод add

Метод добавляет запись, принимая массив значений. Ключами массива являются имена полей сущности.

```php
namespace SomePartner\MyBooksCatalog; // Пространство имен, в котором находится код

use Bitrix\Main\Type; // Подключаем класс Type из пространства имен Bitrix\Main

$result = BookTable::add([
    'ISBN' => '978-0321127426',
    'TITLE' => 'Patterns of Enterprise Application Architecture',
    'PUBLISH_DATE' => new Type\Date('2002-11-16', 'Y-m-d') // Указываем дату публикации книги
]);

if ($result->isSuccess()) { // Проверяем, успешно ли добавлена запись
    $id = $result->getId(); // Получаем ID новой записи для дальнейших операций
}
```

Метод `add` возвращает объект `Entity\AddResult`. Этот объект содержит ID добавленной записи и позволяет проверить, успешно ли была добавлена запись в базу данных.

Для полей типа `DateField` и `DateTimeField`, а также пользовательских полей «Дата» и «Дата со временем» используйте объекты `Bitrix\Main\Type\Date` и `Bitrix\Main\Type\DateTime`. По умолчанию в конструктор передается строковая дата в формате сайта, но можно указать формат явно.

### Метод update

Метод обновляет запись, добавляя к массиву значений первичный ключ.

```php
$result = BookTable::update($id, [
    'PUBLISH_DATE' => new Type\Date('2002-11-15', 'Y-m-d') // Изменить дату
]);
```

Метод `update` в качестве результата возвращает объект `Entity\UpdateResult`, у которого есть проверочный метод `isSuccess()`. Проверочный метод устанавливает, были ли в запросе ошибки.

Чтобы узнать, была ли запись фактически обновлена, используйте метод `getAffectedRowsCount()`.

### Метод delete

Для удаления записи укажите ее первичный ключ.

```php
$result = BookTable::delete($id);
```

Чтобы удалить запись с составным ключом, передайте массив со всеми значениями ключа.

```php
BookTable::delete([
    'key1' => value1,
    'key2' => value2
]);
```

### Результаты операции

Если в ходе операции возникли ошибки, метод вернет массив сообщений об ошибках.

```php
$result = BookTable::update(...); // Выполняем обновление записи в таблице BookTable

if (!$result->isSuccess()) { // Проверяем, успешно ли выполнено обновление
    $errors = $result->getErrorMessages(); // Если обновление не удалось, получаем сообщения об ошибках
}
```

## События

Чтобы хранить в БД только важные данные, используйте обработчик события.

Доступные события:



Чтобы подписаться на событие в любом месте скрипта, используйте менеджер событий. Это позволяет выполнять определенные действия при наступлении событий в системе.

```php
$em = \Bitrix\Main\ORM\EventManager::getInstance();

$em->addEventHandler(
    BookTable::class, // Класс сущности, для которого регистрируется обработчик
    \Bitrix\Main\ORM\Data\DataManager::EVENT_ON_BEFORE_ADD, // Код события, которое будет обрабатываться
    function () { // Ваша callback-функция
        var_dump('handle entity event'); // Действие, выполняемое при срабатывании события
    }
);
```

-  `$em = \Bitrix\Main\ORM\EventManager::getInstance();` создает объект менеджера событий, который управляет подписками на события.

-  `$em->addEventHandler(...)` добавляет обработчик для события. Укажите класс сущности и код события, которое будет обрабатываться.

-  `function () { ... }` -- анонимная callback-функция, которая будет выполнена при срабатывании события.

### Как изменить данные с помощью события

Система распознает метод `onBeforeAdd` как обработчик события «перед добавлением». В нем можно изменить данные или провести дополнительные проверки.

В примере с валидаторами для поля ISBN проверяли наличие 13 цифр. Но в поле ISBN могут быть еще и дефисы, которые не нужно хранить в БД. Изменим поле ISBN с помощью метода `modifyFields`.

```php
class BookTable extends Entity\DataManager
{
	...
	
    public static function onBeforeAdd(Entity\Event $event)
    {
        $result = new Entity\EventResult;
        $data = $event->getParameter("fields");

        if (isset($data['ISBN'])) {
            $cleanIsbn = str_replace('-', '', $data['ISBN']); // Удаляем дефисы из ISBN
            $result->modifyFields(['ISBN' => $cleanIsbn]); // Модифицируем поле ISBN
        }

        return $result;
    }
}
```

```php
// до преобразования
978-0321127426
978-1-449-31428-6
9780201485677
// после преобразования
9780321127426
9781449314286
9780201485677
```

После преобразования в значении остались только цифры, поэтому можно использовать стандартный валидатор `RegExp` -- проверку по регулярному выражению.

```php
'validation' => function() {
    return [
        // function ($value) {
        //     $clean = str_replace('-', '', $value);
        //
        //     if (preg_match('/^\d{13}$/', $clean)) {
        //         return true;
        //     } else {
        //         return 'Код ISBN должен содержать 13 цифр.';
        //     }
        // },
        new Entity\Validator\RegExp('/\d{13}/'), // Валидатор, проверяющий, что значение содержит 13 цифр подряд
        ...
    ];
}
```

### Как запретить обновление данных

В обработчике события можно удалять данные или прерывать операцию. Например, чтобы запретить обновление ISBN для созданных книг, используйте событие `onBeforeUpdate` одним из способов:

-  Удалите ISBN из данных для обновления.

```php
public static function onBeforeUpdate(Entity\Event $event)
{
    $result = new Entity\EventResult;
    $data = $event->getParameter("fields");

    if (isset($data['ISBN'])) {
        $result->unsetFields(['ISBN']); // Удаляет поле ISBN из данных для обновления
    }

    return $result;
}
```

-  Сгенерируйте ошибку при обновлении.

```php
public static function onBeforeUpdate(Entity\Event $event)
{
    $result = new Entity\EventResult;
    $data = $event->getParameter("fields");

    if (isset($data['ISBN'])) {
    // Получает объект поля ISBN и выдает сообщение об ошибке
        $result->addError(new Entity\FieldError( 
            $event->getEntity()->getField('ISBN'), 
            'Запрещено менять ISBN код у существующих книг' 
        ));
    }

    return $result;
}
```

Чтобы узнать, в каком поле произошла ошибка, используйте объект `Entity\FieldError`. Если ошибка касается нескольких полей или всей записи, используйте `Entity\EntityError`.

```php
public static function onBeforeUpdate(Entity\Event $event)
{
    $result = new Entity\EventResult;
    $data = $event->getParameter("fields");

    if (...) { // Здесь должна быть ваша логика комплексной проверки данных
        $result->addError(new Entity\EntityError(
            'Невозможно обновить запись' 
        ));
    }

    return $result;
}
```

## Форматирование значений

Иногда нужно хранить данные в одном формате, а работать с ними -- в другом. Часто это касается массивов, которые сериализуются перед сохранением в БД, то есть преобразуются в строку. Для этого есть параметры поля `save_data_modification` и `fetch_data_modification`, которые задаются через callback.

Пример каталога книг, где поле `EDITIONS_ISBN` будет хранить коды ISBN других изданий книги.

```php
new Entity\TextField('EDITIONS_ISBN', [
    'save_data_modification' => function () {
        return [
            function ($value) {
                return serialize($value); // Преобразует значение в сериализованную строку перед сохранением
            }
        ];
    },
    'fetch_data_modification' => function () {
        return [
            function ($value) {
                return unserialize($value); // Преобразует сериализованную строку обратно в значение при извлечении
            }
        ];
    }
])
```

Для сериализации используйте параметр `serialized`.

```php
new Entity\TextField('EDITIONS_ISBN', [
    'serialized' => true // Автоматически сериализует и десериализует данные
])
```

## Вычисляемые значения

Вычисляемые значения в базе данных помогают поддерживать целостность данных, выполняя расчеты на стороне сервера. Это избавляет от необходимости каждый раз получать старое значение и пересчитывать его в приложении.

Для безопасного обновления данных в базе данных используйте плейсхолдеры. Они помогают избежать SQL-инъекций, экранируя значения и идентификаторы. Список доступных плейсхолдеров:

-  `?` или `?s` -- значение экранируется и заключается в кавычки `'` ,

-  `?#` -- значение экранируется как идентификатор,

-  `?i` -- значение приводится к integer,

-  `?f` -- значение приводится к float.

### Пример использования вычисляемых значений

Чтобы увеличить количество читателей `READERS_COUNT` на 1, можно обновить соответствующее поле в базе данных.

```php
BookTable::update($id, [ // Обновление записи в таблице BookTable
    'READERS_COUNT' => new DB\SqlEx * pression('?# + 1', 'READERS_COUNT') // Увеличение значения поля READERS_COUNT на 1
]);
```

В этом примере плейсхолдер `?#` указывает на идентификатор базы данных, который будет экранирован.

Если число читателей переменное, лучше описать выражение так.

```php
// правильно
BookTable::update($id, [ // Обновление записи в таблице BookTable
    'READERS_COUNT' => new DB\SqlEx * pression('?# + ?i', 'READERS_COUNT', $readersCount) // Увеличение значения поля READERS_COUNT на значение переменной $readersCount
    // '?#' - плейсхолдер для имени поля, заменяется на 'READERS_COUNT'
    // '?i' - плейсхолдер для целочисленного значения, заменяется на $readersCount
]);

// неправильно
BookTable::update($id, [ // Обновление записи в таблице BookTable
    'READERS_COUNT' => new DB\SqlEx * pression('?# + '.$readersCount, 'READERS_COUNT') // Небезопасное увеличение значения поля READERS_COUNT
    // Отсутствие плейсхолдера для значения, что может привести к SQL-инъекциям
]);
```

Здесь `?#` заменяется на имя поля `READERS_COUNT`, а `?i` -- на значение переменной `$readersCount`.

## Предупреждения об ошибках

Вызывать методы можно как с проверкой успешности выполнения запроса, так и без проверки.

В режиме агента рекомендуем проверять результат выполнения операций с помощью `$result->isSuccess()` и логировать ошибки. Если запрос не прошел из-за валидации и не была вызвана проверка `isSuccess()`, система сгенерирует `E_USER_WARNING`.  В сообщении будут перечислены все ошибки.

```php
// Вызов с проверкой успешности выполнения запроса
$result = BookTable::update(...); // Выполнение обновления и сохранение результата
if (!$result->isSuccess()) { // Проверка успешности выполнения
    // обработка ошибки
    // Здесь можно добавить код для обработки ошибок, например, логирование или уведомление пользователя
}

// Вызов без проверки успешности выполнения запроса
BookTable::update(...); // Обновление записи без проверки результата
```

## Пример создания сущности

Создадим класс `BookTable`, который представляет таблицу для хранения информации о книгах. В классе зададим поля таблицы, их типы и правила валидации. С помощью событий настроим обработку данных перед их добавлением в базу.

```php
namespace SomePartner\MyBooksCatalog; // Определение пространства имен для организации кода
use Bitrix\Main\Entity; // Импорт класса Entity для работы с ORM
use Bitrix\Main\Type; // Импорт класса Type для работы с типами данных

class BookTable extends Entity\DataManager // Класс BookTable наследует Entity\DataManager для работы с данными
{
    // Метод для получения имени таблицы
    public static function getTableName()
    {
        return 'my_book'; // Имя таблицы в базе данных
    }

    // Метод для получения уникального идентификатора пользовательских полей
    public static function getUfId()
    {
        return 'MY_BOOK'; // Уникальный идентификатор
    }

    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return array(
            new Entity\IntegerField('ID', array( // Поле ID
                'primary' => true, // Указание, что это первичный ключ
                'autocomplete' => true // Автоинкремент для поля
            )),
            new Entity\StringField('ISBN', array( // Поле ISBN
                'required' => true, // Поле обязательно для заполнения
                'column_name' => 'ISBNCODE', // Имя столбца в базе данных
                'validation' => function() { // Валидация поля
                    return array(
                        new Entity\Validator\RegExp('/\d{13}/'), // Проверка на 13 цифр
                        function ($value, $primary, $row, $field) { // Дополнительная проверка
                            // Проверка контрольной цифры ISBN
                            return new Entity\FieldError(
                                $field, 'Контрольная цифра ISBN не сошлась', 'MY_ISBN_CHECKSUM'
                            ); // Возврат ошибки, если проверка не пройдена
                        }
                    );
                }
            )),
            new Entity\StringField('TITLE'), // Поле для названия книги
            new Entity\DateField('PUBLISH_DATE', array( // Поле для даты публикации
                'default_value' => function () { // Установка значения по умолчанию
                    $lastFriday = date('Y-m-d', strtotime('last friday')); // Вычисление даты последней пятницы
                    return new Type\Date($lastFriday, 'Y-m-d'); // Возврат даты в нужном формате
                }
            )),
            new Entity\TextField('EDITIONS_ISBN', array( // Поле для хранения сериализованных данных
                'serialized' => true // Автоматическая сериализация и десериализация
            )),
            new Entity\IntegerField('READERS_COUNT') // Поле для количества читателей
        );
    }

    // Событие, вызываемое перед добавлением новой записи
    public static function onBeforeAdd(Entity\Event $event)
    {
        $result = new Entity\EventResult; // Создание объекта для результата события
        $data = $event->getParameter("fields"); // Получение данных полей из события
        if (isset($data['ISBN'])) // Проверка наличия поля ISBN
        {
            $cleanIsbn = str_replace('-', '', $data['ISBN']); // Удаление дефисов из ISBN
            $result->modifyFields(array('ISBN' => $cleanIsbn)); // Модификация поля ISBN
        }
        return $result; // Возврат результата события
    }
}
```
