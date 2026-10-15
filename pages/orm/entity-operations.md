---
title: Операции с сущностями и события
description: "Операции с сущностями. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации."
---

Сущность ORM связывает PHP-класс с таблицей базы данных. Через класс-наследник `DataManager` можно добавлять, обновлять и удалять записи, проверять результат операции и подключать обработчики событий.

Правила работы с записью остаются в одном классе:

-  карта полей описывает структуру данных,

-  методы `add`, `update`, `delete`, `addMulti`, `updateMulti` и `deleteByFilter` выполняют операции,

-  события позволяют изменить или проверить данные в нужный момент.

{% note info "" %}

В примерах статьи используется класс `SomePartner\MyBooksCatalog\BookTable`. Полный код класса находится в статье [Концепция ORM](./orm-concepts.md#book-model). Перед обращением к классу подключите модуль вызовом `Loader::includeModule('somepartner.mybookscatalog')` — подробнее в разделе [Подключить модуль сущности](./orm-concepts.md#include-module).

Примеры с нормализацией ISBN дополняют класс обработчиком `onBeforeAdd` из раздела [Изменить данные перед сохранением](#modify-fields).

Все фрагменты класса `BookTable` в статье — трейт `DeleteByFilterTrait`, обработчики `onBeforeAdd` и `onBeforeUpdate` — добавляют код в тот же класс модели. Методы `getTableName()` и `getMap()` в них не повторяются.

{% endnote %}

## Основные операции {#basic-operations}

Для изменения данных используйте методы `add`, `update`, `delete`, `addMulti`, `updateMulti` и `deleteByFilter`. Перед вызовом убедитесь, что таблица из `getTableName()` создана в базе данных. Как создать таблицу по описанию сущности, читайте в статье [Концепция ORM](./orm-concepts.md#create-table).

Объект результата позволяет проверить успешность операции и получить ошибки.

В объект результата попадают ошибки проверки данных: валидаторов, обязательных полей и обработчиков событий. Ошибки базы данных, например отсутствие таблицы или колонки, в результат не попадают: метод выбрасывает исключение `Bitrix\Main\DB\SqlQueryException`. Чтобы обработать такую ошибку, оберните вызов в `try ... catch`.

{% note warning "" %}

Всегда проверяйте результат через `isSuccess()`, `getErrors()` или `getErrorMessages()`. Если операция завершилась с ошибкой, а результат никто не проверил, объект результата при уничтожении выдает предупреждение `E_USER_WARNING` с текстом ошибок.

{% endnote %}

### Добавить запись

Метод `add` принимает массив значений, где ключи совпадают с именами полей в карте ORM-класса.

**Пример.** Код добавляет книгу и получает ее идентификатор. ISBN передан с дефисами: обработчик `onBeforeAdd` уберет их до проверки.

```php
$result = BookTable::add([
    'ISBN' => '978-0321127426',
    'TITLE' => 'Patterns of Enterprise Application Architecture',
    'PUBLISH_DATE' => new \Bitrix\Main\Type\Date('2002-11-15', 'Y-m-d'),
]);

if ($result->isSuccess())
{
    // ID понадобится для последующего update, delete или выборки записи.
    $id = $result->getId();
}
```

Метод `add` возвращает объект `Bitrix\Main\ORM\Data\AddResult`. Чтобы получить идентификатор записи, созданной методом `add`, используйте `getId()`.

Если у сущности составной ключ, `getId()` вернет массив значений ключа.

Метод `addMulti()` добавляет несколько записей одним вызовом. Он принимает массив записей и возвращает такой же объект результата.

Параметр `$ignoreEvents` управляет обработчиками событий. По умолчанию он равен `false`, поэтому события ORM выполняются. Значение `true` отключает обработчики при массовом добавлении.

Со значением `true` ORM не вызывает и обработчик `onBeforeAdd`, который убирает дефисы из ISBN. Поэтому в примере ниже ISBN передан без дефисов: иначе значение не пройдет валидатор `/^\d{13}$/`.

**Пример.** Код добавляет две книги с отключенными событиями.

```php
$result = BookTable::addMulti([
    [
        'ISBN' => '9780321127426',
        'TITLE' => 'Patterns of Enterprise Application Architecture',
        'PUBLISH_DATE' => new \Bitrix\Main\Type\Date('2002-11-15', 'Y-m-d'),
    ],
    [
        'ISBN' => '9780134757599',
        'TITLE' => 'Refactoring',
        'PUBLISH_DATE' => new \Bitrix\Main\Type\Date('2018-11-20', 'Y-m-d'),
    ],
], true);

if (!$result->isSuccess())
{
    var_dump($result->getErrorMessages());
}
```

Для полей с типами `DateField` и `DatetimeField` передавайте объекты `Bitrix\Main\Type\Date` и `Bitrix\Main\Type\DateTime`. Поле не примет строку с датой в `add()` и `update()`. Указывайте формат строки вторым аргументом конструктора, например `'Y-m-d'`: без него конструктор разбирает строку по формату даты сайта. Подробнее о работе с датами читайте в статье [Дата и время](./../advanced/datetime.md).

### Обновить запись

Метод `update` принимает первичный ключ записи и массив новых значений. Методы `update` и `updateMulti` возвращают объект `Bitrix\Main\ORM\Data\UpdateResult`.

В примерах `$id` — значение первичного ключа записи. После добавления записи его можно получить через `$result->getId()`.

```php
use Bitrix\Main\Type\Date;

$result = BookTable::update($id, [
    'PUBLISH_DATE' => new Date('2002-11-15', 'Y-m-d'),
]);

if ($result->isSuccess())
{
    echo $result->getAffectedRowsCount();
}
else
{
    var_dump($result->getErrorMessages());
}
```

После проверки результата через `isSuccess()` используйте `getAffectedRowsCount()`, чтобы узнать, сколько строк фактически изменил успешный SQL-запрос.

Метод `update` не проверяет, есть ли запись с таким первичным ключом. Для несуществующего ключа результат успешный, а `getAffectedRowsCount()` возвращает `0`. В MySQL счетчик учитывает только строки, в которых значения изменились: если записать в поле то же значение, метод тоже вернет `0`.

Ключи массива, которых нет в карте полей, ORM отбрасывает без ошибки. Если в имени поля опечатка, например `TITEL` вместо `TITLE`, операция завершится успешно, но поле не изменится.

**Пример.** Код обновляет запись и отдельно обрабатывает случай, когда ни одна строка не изменилась.

```php
$result = BookTable::update($id, [
    'TITLE' => 'Refactoring',
]);

if (!$result->isSuccess())
{
    var_dump($result->getErrorMessages());
}
elseif ($result->getAffectedRowsCount() === 0)
{
    // Записи с таким ID нет или значения не изменились
}
```

Метод `updateMulti()` обновляет несколько записей одним набором значений. Он принимает массив первичных ключей и массив новых значений.

Параметр `$ignoreEvents` работает так же, как в `addMulti()`: значение `true` отключает обработчики событий при массовом обновлении.

```php
$result = BookTable::updateMulti(
    [$firstBookId, $secondBookId],
    ['READERS_COUNT' => 0],
    true
);

if ($result->isSuccess())
{
    echo $result->getAffectedRowsCount();
}
else
{
    var_dump($result->getErrorMessages());
}
```

### Удалить запись

Метод `delete` удаляет запись по первичному ключу.

```php
$result = BookTable::delete($id);
if ($result->isSuccess())
{
    echo "Deleted";
}
else
{
    var_dump($result->getErrorMessages());
}
```

Если у ORM-класса составной ключ, передайте массив со значениями всех частей ключа.

**Пример.** Код удаляет запись о наличии книги в магазине. Первичный ключ класса `StoreBookTable` состоит из полей `STORE_ID` и `BOOK_ID`.

```php
$result = StoreBookTable::delete([
    'BOOK_ID' => $bookId,
    'STORE_ID' => $storeId,
]);
```

Метод `delete` возвращает объект `Bitrix\Main\ORM\Data\DeleteResult`. Успешность удаления проверяйте через `isSuccess()` в объекте результата.

Метод `delete` не проверяет, есть ли запись с таким первичным ключом: для несуществующего ключа результат тоже успешный. Метода `getAffectedRowsCount()` у `DeleteResult` нет. Если важно знать, была ли запись, получите ее до удаления, например методом `getByPrimary()`.

Чтобы удалять записи по фильтру, подключите к классу сущности `Bitrix\Main\ORM\Data\Internal\DeleteByFilterTrait`. После этого в классе будет доступен метод `deleteByFilter()`.

**Пример.** Класс `BookTable` подключает трейт удаления по фильтру.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Data\Internal\DeleteByFilterTrait;

class BookTable extends DataManager
{
    use DeleteByFilterTrait;

    // getTableName() и getMap() — как в статье «Концепция ORM»
}
```

**Пример.** Код удаляет книги без читателей, то есть со значением `READERS_COUNT` меньше единицы.

```php
BookTable::deleteByFilter([
    '<READERS_COUNT' => 1,
]);
```

`deleteByFilter()` не удаляет записи по пустому фильтру. Если нужно удалить все записи таблицы, используйте отдельный сценарий очистки таблицы.

## События {#events}

События ORM срабатывают при `add`, `update` и `delete`: до проверки данных, перед SQL-запросом и после успешной операции.

Используйте события, чтобы нормализовать значения, остановить операцию с ошибкой или выполнить связанное действие после сохранения.

#|
|| **Событие** | **Когда срабатывает** | **Основные параметры** ||
|| **OnBeforeAdd** | При подготовке новой записи к добавлению | `fields` — значения полей, `object` — объект записи ||
|| **OnAdd** | При добавлении записи перед SQL-запросом | `fields` — значения полей, `object` — копия объекта записи ||
|| **OnAfterAdd** | После успешного добавления записи | `primary` — первичный ключ, `fields` — значения полей, `object` — копия объекта записи ||
|| **OnBeforeUpdate** | При подготовке существующей записи к обновлению | `primary` — первичный ключ, `fields` — новые значения полей, `object` — объект записи ||
|| **OnUpdate** | При обновлении записи перед SQL-запросом | `primary` — первичный ключ, `fields` — новые значения полей, `object` — копия объекта записи ||
|| **OnAfterUpdate** | После успешного обновления записи | `primary` — первичный ключ, `fields` — обновленные значения, `object` — копия объекта записи ||
|| **OnBeforeDelete** | При подготовке записи к удалению | `primary` — первичный ключ, `object` — копия объекта записи. Параметр `fields` в событие удаления не передается ||
|| **OnDelete** | При удалении записи перед SQL-запросом | `primary` — первичный ключ, `object` — копия объекта записи ||
|| **OnAfterDelete** | После успешного удаления записи | `primary` — первичный ключ, `object` — копия объекта записи ||
|#

Возможности обработчика зависят от типа события:

-  в `OnBeforeAdd` и `OnBeforeUpdate` можно вернуть `EventResult`, чтобы изменить поля, исключить поля из операции или прервать операцию ошибкой,

-  в `OnBeforeDelete` через `EventResult` можно вернуть ошибку и прервать удаление,

-  в `OnAdd`, `OnUpdate`, `OnDelete` и событиях `OnAfter*` обычно выполняют сопутствующую логику: логирование, очистку кеша или запуск связанных действий.

### Зарегистрировать обработчик

Регистрация обработчика связывает событие сущности с обработчиком, который выполнится при операции.

`Bitrix\Main\ORM\EventManager` регистрирует обработчик для конкретного класса сущности и события. Обработчик получает объект `Bitrix\Main\ORM\Event`.

Обработчик можно подключить тремя способами:

-  статическим методом класса-наследника `DataManager` — для правил самой сущности: нормализации полей, обязательных проверок, запрета удаления,

-  через `EventManager::addEventHandler()` — для временной регистрации,

-  через `EventManager::registerEventHandler()` — для постоянной регистрации обработчиков модуля или интеграции.

{% note info "" %}

Для статического метода используйте имя события с маленькой буквы: событию `OnBeforeAdd` соответствует метод `onBeforeAdd`.

Пример статического метода — в блоке [Изменить данные перед сохранением](#modify-fields).

{% endnote %}

Методы `addEventHandler()` и `registerEventHandler()` принимают класс сущности и код события, но хранят регистрацию по-разному:

-  `addEventHandler()` регистрирует обработчик только на время текущего запроса. Вызывайте метод на каждом запросе: разместите вызов в `/local/php_interface/init.php` или в `include.php` модуля. Метод принимает callable.

-  `registerEventHandler()` сохраняет регистрацию в базе данных, и она действует, пока ее не удалят. Вызовите метод один раз в методе `InstallDB()` установщика модуля, а в `UnInstallDB()` удалите регистрацию методом `unRegisterEventHandler()`. Об установщике читайте в статье [Создание модуля](./../get-started/create-module.md). Метод принимает код модуля-обработчика, имя класса и имя метода: перед вызовом обработчика система подключает этот модуль.

В примерах ниже обработчик — статический метод `normalizeBookBeforeAdd()` класса `SomePartner\MyBooksCatalog\EventHandler`. Метод принимает объект `Bitrix\Main\ORM\Event` и возвращает `Bitrix\Main\ORM\EventResult`. Тело метода такое же, как у метода `onBeforeAdd` из раздела [Изменить данные перед сохранением](#modify-fields). Класс `DataManager` в примерах нужен только для константы `EVENT_ON_BEFORE_ADD`, которая соответствует событию `OnBeforeAdd`.

**Пример.** Код регистрирует обработчик `OnBeforeAdd` на время текущего запроса.

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\EventManager;
use SomePartner\MyBooksCatalog\BookTable;
use SomePartner\MyBooksCatalog\EventHandler;

EventManager::getInstance()->addEventHandler(
    BookTable::class,
    DataManager::EVENT_ON_BEFORE_ADD,
    [EventHandler::class, 'normalizeBookBeforeAdd']
);
```

**Пример.** Код постоянно регистрирует тот же обработчик из установщика модуля `somepartner.mybookscatalog`.

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\EventManager;
use SomePartner\MyBooksCatalog\BookTable;
use SomePartner\MyBooksCatalog\EventHandler;

EventManager::getInstance()->registerEventHandler(
    BookTable::class,
    DataManager::EVENT_ON_BEFORE_ADD,
    'somepartner.mybookscatalog',
    EventHandler::class,
    'normalizeBookBeforeAdd'
);
```

### Изменить данные перед сохранением {#modify-fields}

Метод `modifyFields()` меняет значения в `OnBeforeAdd` и `OnBeforeUpdate`. Такой обработчик подходит для нормализации данных перед валидацией и записью в базу.

**Пример.** Обработчик `onBeforeAdd` в классе `BookTable` убирает дефисы из ISBN до проверки валидатором `/^\d{13}$/`.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventResult;

class BookTable extends DataManager
{
    // getTableName() и getMap() — как в статье «Концепция ORM»

    public static function onBeforeAdd(Event $event): EventResult
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');

        if (isset($fields['ISBN']))
        {
            $result->modifyFields([
                'ISBN' => str_replace('-', '', $fields['ISBN']),
            ]);
        }

        return $result;
    }
}
```

Например, значение `978-0321127426` будет сохранено как `9780321127426`. После такой нормализации поле можно проверять валидатором на 13 цифр.

**Пример.** Фрагмент поля ISBN из модели `BookTable` с валидатором на 13 цифр. Остальные настройки поля — как в статье [Концепция ORM](./orm-concepts.md#book-model).

```php
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Fields\Validators\RegExpValidator;

(new StringField('ISBN'))
    ->configureRequired()
    ->configureColumnName('ISBNCODE')
    ->addValidator(new RegExpValidator('/^\d{13}$/'))
;
```

{% note warning "" %}

Метод `modifyFields()` заменяет набор изменений, а не дополняет его. Если вызвать метод дважды, первый набор пропадет без ошибки. Соберите все изменения в один массив и передайте его одним вызовом.

Обработчик должен возвращать объект `Bitrix\Main\ORM\EventResult`. Если статический метод сущности вернет другой объект, ORM заменит его пустым `EventResult`, и изменения не применятся. У класса `Bitrix\Main\EventResult` другой конструктор и нет метода `modifyFields()`.

{% endnote %}

### Запретить обновление поля

Метод `unsetFields()` удаляет поле из данных операции. Используйте этот способ, если обновление поля нужно пропустить без ошибки.

Если после `unsetFields()` не осталось полей для обновления, `update` завершится без ошибки и без изменения записи.

Примеры этого раздела — варианты одного метода `onBeforeUpdate` класса `BookTable`. В классе может быть только один такой метод: выберите вариант или объедините проверки в одном методе.

**Пример.** Обработчик исключает поле `ISBN` из обновления без ошибки.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventResult;

class BookTable extends DataManager
{
    // getTableName() и getMap() — как в статье «Концепция ORM»

    public static function onBeforeUpdate(Event $event): EventResult
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');

        if (isset($fields['ISBN']))
        {
            // ORM исключит поле из SQL-запроса на обновление
            $result->unsetFields(['ISBN']);
        }

        return $result;
    }
}
```

Метод `addError()` прерывает операцию и добавляет ошибку в объект результата. Метод принимает только объекты `Bitrix\Main\ORM\EntityError` и `Bitrix\Main\ORM\Fields\FieldError`. Если передать объект `Bitrix\Main\Error`, PHP выбросит `TypeError`.

Тексты ошибок в примерах получает метод `Loc::getMessage()`. Он сам подключает языковой файл для файла, из которого его вызвали. Для класса в `/local/modules/somepartner.mybookscatalog/lib/booktable.php` фразы `BOOK_ERROR_*` храните в файле `/local/modules/somepartner.mybookscatalog/lang/ru/lib/booktable.php`. Как устроены языковые файлы, читайте в статье [Локализация](./../advanced/localization.md).

**Пример.** Обработчик прерывает обновление ошибкой, которая относится к полю `ISBN`.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\Localization\Loc;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventResult;
use Bitrix\Main\ORM\Fields\FieldError;

class BookTable extends DataManager
{
    // getTableName() и getMap() — как в статье «Концепция ORM»

    public static function onBeforeUpdate(Event $event): EventResult
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');

        if (isset($fields['ISBN']))
        {
            $result->addError(new FieldError(
                $event->getEntity()->getField('ISBN'),
                Loc::getMessage('BOOK_ERROR_ISBN_CHANGE_DENIED')
            ));
        }

        return $result;
    }
}
```

**Пример.** Обработчик прерывает обновление ошибкой, которая относится ко всей записи.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\Localization\Loc;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\EntityError;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventResult;

class BookTable extends DataManager
{
    // getTableName() и getMap() — как в статье «Концепция ORM»

    public static function onBeforeUpdate(Event $event): EventResult
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');

        if (empty($fields))
        {
            $result->addError(new EntityError(
                Loc::getMessage('BOOK_ERROR_EMPTY_UPDATE')
            ));
        }

        return $result;
    }
}
```

## Форматирование значений

Данные можно хранить в одном формате, а возвращать из ORM в другом. Для массивов используйте `ArrayField`: он подключает модификаторы сохранения и чтения.

Метод `configureSerializationJson()` сохраняет массив в базе данных как JSON-строку.

```php
use Bitrix\Main\ORM\Fields\ArrayField;

(new ArrayField('EDITIONS_ISBN'))
    ->configureSerializationJson()
;
```

Если нужен собственный формат, добавьте модификаторы поля. В примере ниже поле `EDITIONS_ISBN` описано как `TextField` вместо `ArrayField` из модели `BookTable`: массив хранится строкой через запятую.

Метод `addSaveDataModifier()` добавляет модификатор сохранения. Его callback получает значение перед записью в базу.

Метод `addFetchDataModifier()` добавляет модификатор чтения. Его callback получает значение после выборки.

```php
use Bitrix\Main\ORM\Fields\TextField;

(new TextField('EDITIONS_ISBN'))
    ->addSaveDataModifier(static function (array $value): string
    {
        // Перед сохранением массив ISBN превращаем в строку
        return implode(',', $value);
    })
    ->addFetchDataModifier(static function (?string $value): array
    {
        if ($value === null || $value === '')
        {
            return [];
        }

        return explode(',', $value);
    })
;
```

## Вычисляемые значения {#sql-expression}

`Bitrix\Main\DB\SqlExpression` задает значение поля через SQL-выражение. Используйте его, когда новое значение зависит от текущего значения в базе данных.

Например, чтобы увеличить `READERS_COUNT` на 1, передайте в `update` выражение `?# + 1`. Так база изменит текущее значение поля без отдельной выборки записи.

```php
use Bitrix\Main\DB\SqlExpression;

BookTable::update($id, [
    'READERS_COUNT' => new SqlExpression('?# + 1', 'READERS_COUNT'),
]);
```

Плейсхолдеры в `SqlExpression` экранируют значения и идентификаторы.

Список плейсхолдеров и правила их применения смотрите в статье [SqlExpression и SqlHelper](./../database/sql-helper-and-expression.md).

Если прибавляемое значение приходит из переменной, добавьте для него отдельный плейсхолдер.

```php
use Bitrix\Main\DB\SqlExpression;

BookTable::update($id, [
    // ?# экранирует имя поля, ?i приводит значение к целому числу.
    'READERS_COUNT' => new SqlExpression('?# + ?i', 'READERS_COUNT', $readersCount),
]);
```

{% note warning "" %}

Передавайте переменные только через плейсхолдеры в `SqlExpression`. Не подставляйте переменные в SQL-строку через конкатенацию, то есть через склейку строк оператором `.`.

Если значение добавить в SQL-строку напрямую, ORM не приведет его к нужному типу и не экранирует. Такой код может привести к SQL-инъекции: часть значения будет воспринята базой данных как SQL-команда.

{% endnote %}

Подробнее о рисках и защите читайте в статье [SQL-инъекции](./../security/sql-injection.md).
