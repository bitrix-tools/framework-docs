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

В примерах статьи используется класс `BookTable`. Он описывает таблицу книг и поля `ISBN`, `TITLE`, `PUBLISH_DATE`, `EDITIONS_ISBN`, `READERS_COUNT`.

Полный код класса находится в разделе [Пример класса `BookTable`](#booktable-example).

{% endnote %}

## Основные операции

Для изменения данных используйте методы `add`, `update`, `delete`, `addMulti`, `updateMulti` и `deleteByFilter`. Перед вызовом убедитесь, что таблица из `getTableName()` создана в базе данных.

Объект результата позволяет проверить успешность операции и получить ошибки.

### Добавить запись

Метод `add` принимает массив значений, где ключи совпадают с именами полей в карте ORM-класса.

```php
$result = BookTable::add([
    'ISBN' => '978-0321127426',
    'TITLE' => 'Patterns of Enterprise Application Architecture',
    'PUBLISH_DATE' => new \Bitrix\Main\Type\Date('16.11.2002'),
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

```php
$result = BookTable::addMulti([
    [
        'ISBN' => '978-0321127426',
        'TITLE' => 'Patterns of Enterprise Application Architecture',
        'PUBLISH_DATE' => new \Bitrix\Main\Type\Date('16.11.2002'),
    ],
    [
        'ISBN' => '978-0134757599',
        'TITLE' => 'Refactoring',
        'PUBLISH_DATE' => new \Bitrix\Main\Type\DateTime('16.11.2002 10:30:00'),
    ],
], true);

if (!$result->isSuccess())
{
    var_dump($result->getErrorMessages());
}
```

Для полей с типами `DateField` и `DateTimeField` передавайте объекты `Bitrix\Main\Type\Date` и `Bitrix\Main\Type\DateTime`. Подробнее о работе с датами читайте в статье [Дата и время](./../advanced/datetime.md).

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

```php
$result = BookTable::delete([
    'BOOK_ID' => $bookId,
    'STORE_ID' => $storeId,
]);
```

Метод `delete` возвращает объект `Bitrix\Main\ORM\Data\DeleteResult`. Успешность удаления проверяйте через `isSuccess()` в объекте результата.

Чтобы удалять записи по фильтру, подключите к классу сущности `Bitrix\Main\ORM\Data\Internal\DeleteByFilterTrait`. После этого в классе будет доступен метод `deleteByFilter()`.

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Data\Internal\DeleteByFilterTrait;

class BookTable extends DataManager
{
    use DeleteByFilterTrait;
}
```

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

Обработчик можно подключить двумя способами:

-  статическим методом класса-наследника `DataManager` — для правил самой сущности: нормализации полей, обязательных проверок, запрета удаления,

-  через `EventManager::registerEventHandler()` — для обработчиков модуля или интеграции.

{% note info "" %}

Для статического метода используйте имя события с маленькой буквы: событию `OnBeforeAdd` соответствует метод `onBeforeAdd`.

Пример статического метода — в блоке [Изменить данные перед сохранением](#modify-fields).

{% endnote %}

Через `EventManager::addEventHandler()` обработчик регистрируют для класса сущности и кода события. Класс `DataManager` нужен только для константы события `EVENT_ON_BEFORE_ADD`, которая соответствует событию `OnBeforeAdd`.

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\EventManager;

EventManager::getInstance()->registerEventHandler(
    \Vendor\Books\BookTable::class,
    DataManager::EVENT_ON_BEFORE_ADD,
    'vendor.books',
    \Vendor\Books\EventHandler::class,
    'normalizeBookBeforeAdd'
);
```

### Изменить данные перед сохранением {#modify-fields}

Метод `modifyFields()` меняет значения в `OnBeforeAdd` и `OnBeforeUpdate`. Такой обработчик подходит для нормализации данных перед валидацией и записью в базу.

```php
namespace Vendor\Books;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventResult;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Fields\Validators\RegExpValidator;

class BookTable extends DataManager
{
    public static function getTableName()
    {
        return 'my_book';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))
                ->configurePrimary()
                ->configureAutocomplete(),

            (new StringField('ISBN'))
                ->configureRequired()
                ->addValidator(new RegExpValidator('/^\d{13}$/')),
        ];
    }

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

```php
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Fields\Validators\RegExpValidator;

(new StringField('ISBN'))
    ->configureRequired()
    ->addValidator(new RegExpValidator('/^\d{13}$/'))
;
```

### Запретить обновление поля

Метод `unsetFields()` удаляет поле из данных операции. Используйте этот способ, если обновление поля нужно пропустить без ошибки.

Если после `unsetFields()` не осталось полей для обновления, `update` завершится без ошибки и без изменения записи.

```php
public static function onBeforeUpdate(Event $event)
{
    $result = new EventResult();
    $fields = $event->getParameter('fields');

    if (isset($fields['ISBN']))
    {
        // Поле будет исключено из SQL-запроса на обновление.
        $result->unsetFields(['ISBN']);
    }

    return $result;
}
```

Метод `addError()` прерывает операцию и добавляет ошибку в объект результата. Можно использовать любой класс ошибки, совместимый с результатом операции.

Пример ошибки, которая относится к конкретному полю:

```php
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\ORM\Fields\FieldError;

public static function onBeforeUpdate(Event $event)
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
```

Пример ошибки, которая относится ко всей записи:

```php
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\ORM\EntityError;

public static function onBeforeUpdate(Event $event)
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

Если нужен собственный формат, добавьте модификаторы поля.

Метод `addSaveDataModifier()` добавляет модификатор сохранения. Его callback получает значение перед записью в базу.

Метод `addFetchDataModifier()` добавляет модификатор чтения. Его callback получает значение после выборки.

```php
use Bitrix\Main\ORM\Fields\TextField;

(new TextField('EDITIONS_ISBN'))
    ->addSaveDataModifier(static function (array $value): string
    {
        // Перед сохранением массив ISBN преобразуется в строку.
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

## Вычисляемые значения

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

## Пример класса `BookTable` {#booktable-example}

Класс `BookTable` задает имя таблицы, карту полей и обработчик события. В карте полей настройки задаются через методы `configure*` и `addValidator()`.

```php
namespace Vendor\Books;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventResult;
use Bitrix\Main\ORM\Fields\ArrayField;
use Bitrix\Main\ORM\Fields\DateField;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Fields\Validators\RegExpValidator;
use Bitrix\Main\Type\Date;

class BookTable extends DataManager
{
    public static function getTableName()
    {
        return 'my_book';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))
                // ID -- первичный ключ с автоинкрементом.
                ->configurePrimary()
                ->configureAutocomplete(),

            (new StringField('ISBN'))
                // В таблице поле хранится в столбце ISBNCODE.
                ->configureRequired()
                ->configureColumnName('ISBNCODE')
                ->addValidator(new RegExpValidator('/^\d{13}$/')),

            (new StringField('TITLE'))
                ->configureRequired(),

            (new DateField('PUBLISH_DATE'))
                ->configureDefaultValue(static function (): Date
                {
                    return new Date(date('Y-m-d'), 'Y-m-d');
                }),

            (new ArrayField('EDITIONS_ISBN'))
                // Массив ISBN хранится в JSON.
                ->configureSerializationJson(),

            (new IntegerField('READERS_COUNT'))
                ->configureDefaultValue(0),
        ];
    }

    public static function onBeforeAdd(Event $event)
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');

        if (isset($fields['ISBN']))
        {
            // Нормализуем ISBN до проверки валидатором.
            $result->modifyFields([
                'ISBN' => str_replace('-', '', $fields['ISBN']),
            ]);
        }

        return $result;
    }
}
```
