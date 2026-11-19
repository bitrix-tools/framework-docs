---
title: Отношения между сущностями
description: 'Отношения между сущностями. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

В ORM отношения между сущностями описывают, как данные одной таблицы связаны с данными другой. Основные типы отношений:

-  1:1, «один к одному». Каждая запись в первой таблице соответствует одной записи во второй таблице.

-  1:N, «один ко многим». Одна запись в первой таблице может быть связана с несколькими записями во второй таблице.

-  N:M, «многие ко многим». Записи в первой таблице могут быть связаны с несколькими записями во второй таблице и наоборот.

Отношения описывают полями из пространства имен `Bitrix\Main\ORM\Fields\Relations` в методе `getMap` сущности. Набор полей зависит от типа отношения.

| Отношение | Поля в сущностях | Где хранится связь |
|---|---|---|
| 1:N | `Reference` в сущности на стороне N, `OneToMany` в сущности на стороне 1 | Поле внешнего ключа в таблице на стороне N, например `PUBLISHER_ID` книги |
| 1:1 | `Reference` в обеих сущностях | Поле внешнего ключа в одной из таблиц, например `COVER_ID` книги |
| N:M | `ManyToMany` в обеих сущностях | Таблица-связка из первичных ключей двух сущностей |
| N:M с дополнительными данными | Промежуточная сущность с двумя полями `Reference`, `OneToMany` в исходных сущностях | Таблица промежуточной сущности, например `StoreBookTable` |

## Пример схемы отношений

В примерах участвуют пять сущностей — книга `Book`, автор `Author`, издательство `Publisher`, обложка `Cover` и магазин `Store`. Схема отношений сущностей:

-  книга принадлежит одному издательству,

-  у книги может быть несколько авторов,

-  одна книга может иметь только одну обложку, и одна обложка принадлежит только одной книге,

-  книга продается в нескольких магазинах.

Сущности относятся к модулю `somepartner.mybookscatalog` и находятся в пространстве имен `SomePartner\MyBooksCatalog`. Полное описание `BookTable` и состав полей связанных сущностей смотрите в статье [Концепция ORM](./orm-concepts.md#book-model). Перед обращением к классам подключите модуль вызовом `Loader::includeModule('somepartner.mybookscatalog')` — подробнее в разделе [Подключить модуль сущности](./orm-concepts.md#include-module).

Примеры ниже показывают классы частично, только с полями, которые нужны для описываемой связи. Комментарий `// Остальные поля сущности` в коде заменяет поля из описания модели. Обложка `Cover` в основную модель не входит и нужна только для примера связи «один к одному».

Методы `fetchObject()` и `wakeUpObject()` возвращают объекты системных классов `EO_Book`, `EO_Publisher`, `EO_Author` и других. ORM создает эти классы по описанию сущностей. Методы объектов для полей отношений, например `getPublisher()` и `addToBooks()`, ORM формирует по именам полей — подробнее в статье [Объекты](./objects.md).

{% note info "" %}

Примеры с выборкой и изменением предполагают, что в таблицах модуля уже есть книги, авторы, издательства и магазины с указанными в коде ID. Показанный вывод соответствует этим условным данным.

{% endnote %}

## Отношение 1:N, «один ко многим»

Одна запись в таблице может соответствовать множеству записей в другой. Такую связь описывают два поля:

-  [`Reference`](../api-reference/main/orm/fields/relations/reference/index.md) — сторона «многие к одному», поле в сущности, которая хранит внешний ключ,

-  `OneToMany` — сторона «один ко многим», поле в связанной сущности.

Параметры конструктора `Reference`:

-  `$name` — имя поля, строка,

-  `$referenceEntity` — связываемая сущность: имя класса, например `PublisherTable::class`, или объект `Bitrix\Main\ORM\Entity`,

-  `$referenceFilter` — условие соединения таблиц, обычно результат `Join::on()`.

В условии соединения префиксы `this.` и `ref.` указывают на поля текущей и связанной сущностей. Дополнительные условия добавьте в цепочку после `Join::on()` — подробнее в разделе «Условия JOIN» статьи [Выборка данных](./querying-data.md). Пустое условие конструктор не принимает и выбрасывает исключение `Bitrix\Main\ArgumentException`.

Тип соединения поля `Reference` по умолчанию — LEFT JOIN. Метод `configureJoinType()` меняет тип соединения. Метод принимает значения `INNER`, `LEFT`, `LEFT OUTER`, `RIGHT` и `RIGHT OUTER` в любом регистре или константы `Join::TYPE_*`. Четвертый параметр конструктора `$parameters` устарел, вместо него используйте методы `configure*`.

Параметры конструктора `OneToMany`:

-  `$name` — имя поля, строка,

-  `$referenceEntity` — связываемая сущность: имя класса или объект `Bitrix\Main\ORM\Entity`,

-  `$referenceName` — имя поля `Reference` в связанной сущности, которое указывает на текущую сущность.

Если тип соединения поля `OneToMany` не задан, ORM берет тип соединения поля `Reference`, имя которого передано в `$referenceName`.

### Пример связи «многие к одному»

Каждая книга издается в одном издательстве, что создает отношение «N книг — 1 издательство». Чтобы описать эту связь, нужно:

-  добавить поле `PUBLISHER_ID` в таблицу книг,

-  создать связь между таблицами книг и издательств.

#### 1\. Определить поле `PUBLISHER_ID`

Добавьте в карту полей `BookTable` целочисленное поле `PUBLISHER_ID` — внешний ключ, который хранит ID издательства книги:

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            new IntegerField('PUBLISHER_ID'), // ID издательства книги
        ];
    }
}
```

#### 2\. Определить связь «многие к одному»

Опишите в `BookTable` поле `Reference` с именем `PUBLISHER`. Условие [`Join::on('this.PUBLISHER_ID', 'ref.ID')`](../api-reference/main/orm/query/join/on.md) связывает поле `PUBLISHER_ID` книги с полем `ID` издательства. Тип соединения INNER JOIN задан так же, как в описании модели:

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            new IntegerField('PUBLISHER_ID'),

            (new Reference(
                'PUBLISHER', // Имя поля связи
                PublisherTable::class, // Связанная сущность
                Join::on('this.PUBLISHER_ID', 'ref.ID') // Условие соединения
            ))
                ->configureJoinType('inner'),
        ];
    }
}
```

#### 3\. Получить объект издательства через книгу

Метод `getPublisher()` возвращает объект издательства, если поле `PUBLISHER` загружено. Чтобы загрузить его вместе с книгой, добавьте имя поля в параметр `select`. Если поле не загружено, метод возвращает `null`. Для уже полученной книги издательство загружает метод `fillPublisher()` — подробнее в разделе [Заполнить объект](./objects.md#fill).

**Пример.** Код выбирает книгу с ID 1 вместе с издательством и выводит название издательства.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1, [
    'select' => ['*', 'PUBLISHER'], // Все поля книги и поля издательства
])->fetchObject();

echo $book->getPublisher()->getTitle(); // Publisher Title 253
```

#### 4\. Установить связь между книгой и издательством

Чтобы связать книгу с издательством, передайте объект издательства в метод `setPublisher()`. Метод записывает первичный ключ издательства в поле `PUBLISHER_ID` книги. Метод `save()` книги сохраняет новое значение в базе данных.

**Пример.** Код привязывает книгу с ID 1 к издательству с ID 253. Метод `wakeUpObject()` создает объект издательства по первичному ключу без запроса к базе данных.

```php
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::wakeUpObject(253);

$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;

$book->setPublisher($publisher);
$book->save();
```

#### 5\. Результат для массивов

**Пример.** Метод `fetch()` возвращает массив с полями книги и полями издательства. Имена полей издательства начинаются с кода сущности книги и имени поля связи `SOMEPARTNER_MYBOOKSCATALOG_BOOK_PUBLISHER_`.

```php
$result = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1, [
    'select' => ['*', 'PUBLISHER'], // Выбор всех полей книги и связанных данных издательства
]);

print_r($result->fetch());
/* Выведет:
Array (
    [ID] => 1
    [ISBN] => 9780321127426
    [TITLE] => Title 1
    [PUBLISH_DATE] => Bitrix\Main\Type\Date Object (...)
    [PUBLISHER_ID] => 253
    [IS_ARCHIVED] => Y
    [EDITIONS_ISBN] => Array ()
    [READERS_COUNT] => 0
    [SOMEPARTNER_MYBOOKSCATALOG_BOOK_PUBLISHER_ID] => 253
    [SOMEPARTNER_MYBOOKSCATALOG_BOOK_PUBLISHER_TITLE] => Publisher Title 253
)
*/
```

#### 6\. Как использовать алиасы для полей

По умолчанию поля связанной сущности получают уникальные имена, основанные на пространстве имен и имени класса. Чтобы получить короткие имена, передайте в `select` префикс ключом массива, а имя поля связи — значением.

**Пример.** Ключ `PUB_` задает префикс для полей издательства. Вместо `SOMEPARTNER_MYBOOKSCATALOG_BOOK_PUBLISHER_TITLE` массив содержит ключ `PUB_TITLE`.

```php
$result = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1, [
    'select' => ['*', 'PUB_' => 'PUBLISHER'], // Поля издательства будут представлены в виде алиасов с префиксом PUB_
]);

print_r($result->fetch());
/* Выведет:
Array (
    [ID] => 1
    [ISBN] => 9780321127426
    [TITLE] => Title 1
    [PUBLISH_DATE] => Bitrix\Main\Type\Date Object (...)
    [PUBLISHER_ID] => 253
    [IS_ARCHIVED] => Y
    [EDITIONS_ISBN] => Array ()
    [READERS_COUNT] => 0
    [PUB_ID] => 253
    [PUB_TITLE] => Publisher Title 253
)
*/
```

### Пример связи «один ко многим»

Поле `OneToMany` описывает обратную сторону связи «многие к одному». У издательства может быть много книг, и поле `BOOKS` издательства опирается на поле `PUBLISHER` книги из предыдущего примера.

#### 1\. Определить класс PublisherTable

Опишите в `PublisherTable` поле `BOOKS`. Третий аргумент конструктора — имя поля `Reference` в `BookTable`, которое указывает на издательство:

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\OneToMany;

class PublisherTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            new OneToMany('BOOKS', BookTable::class, 'PUBLISHER'),
        ];
    }
}
```

Тип соединения у поля `BOOKS` не задан, поэтому ORM берет его из поля `PUBLISHER` книги — INNER JOIN. Издательство без книг в выборку с полем `BOOKS` не попадет. Чтобы выбирать и такие издательства, вызовите у поля `BOOKS` метод `configureJoinType('left')`.

#### 2\. Выбрать данные через связь

**Пример.** Код выбирает издательство с ID 253 вместе с книгами и выводит названия книг.

```php
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::getByPrimary(253, [
    'select' => ['*', 'BOOKS'], // Все поля издательства и поля его книг
])->fetchObject();

foreach ($publisher->getBooks() as $book)
{
    echo $book->getTitle();
}
// Цикл выведет "Title 1" и "Title 2"
```

Метод `fetchObject()` возвращает один объект издательства, даже если у него несколько книг. Метод `getBooks()` возвращает коллекцию книг — объект класса `EO_Book_Collection`, если свой класс коллекции не задан. Без поля `BOOKS` в `select` метод `getBooks()` возвращает `null`. Методы коллекции описаны в статье [Коллекции](./collections.md).

#### 3\. Получить данные в виде массива

**Пример.** Метод `fetchAll()` возвращает по строке на каждую книгу издательства. Поля издательства повторяются в каждой строке.

```php
$data = \SomePartner\MyBooksCatalog\PublisherTable::getByPrimary(253, [
    'select' => ['*', 'BOOK_' => 'BOOKS'] // Выбор всех полей издательства и связанных данных книг с префиксом
])->fetchAll();

/* Вернет:
Array (
    [0] => Array (
        [ID] => 253
        [TITLE] => Publisher Title 253
        [BOOK_ID] => 1
        [BOOK_ISBN] => 9780321127426
        [BOOK_TITLE] => Title 1
        [BOOK_PUBLISH_DATE] => Bitrix\Main\Type\Date Object (...)
        [BOOK_PUBLISHER_ID] => 253
        [BOOK_IS_ARCHIVED] => Y
        [BOOK_EDITIONS_ISBN] => Array ()
        [BOOK_READERS_COUNT] => 0
    )
    [1] => Array (
        [ID] => 253
        [TITLE] => Publisher Title 253
        [BOOK_ID] => 2
        [BOOK_ISBN] => 9780134757599
        [BOOK_TITLE] => Title 2
        [BOOK_PUBLISH_DATE] => Bitrix\Main\Type\Date Object (...)
        [BOOK_PUBLISHER_ID] => 253
        [BOOK_IS_ARCHIVED] => N
        [BOOK_EDITIONS_ISBN] => Array ()
        [BOOK_READERS_COUNT] => 0
    )
)
*/
```

Строк в результате столько, сколько связанных книг. Поэтому ограничение `limit` в запросе со связью 1:N считает строки, а не издательства — как обойти это ограничение, читайте в разделе [Решение проблем](./querying-data.md#decompose) статьи «Выборка данных».

#### 4\. Как добавить объект

Чтобы добавить книгу в коллекцию книг издательства, используйте метод `addToBooks()`. Метод принимает существующий или новый объект книги и записывает издательство в поле `PUBLISHER` книги. Метод `save()` издательства сохраняет все объекты коллекции `BOOKS`, в том числе добавленные. Объект книги без изменений запрос на обновление не выполняет.

**Пример.** Код добавляет книгу с ID 2 к издательству с ID 253.

```php
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::getByPrimary(253)
    ->fetchObject()
;

$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(2)
    ->fetchObject()
;

$publisher->addToBooks($book);
$publisher->save();
```

Без объектов задайте поле `PUBLISHER_ID` книги. Передайте его в `BookTable::add()` при создании книги или в `BookTable::update()` для существующей книги.

#### 5\. Как удалить связь

Со стороны книги связь удаляет вызов `setPublisher(null)`. Метод записывает `null` в поле `PUBLISHER_ID`, запись книги остается в базе данных.

Столбец внешнего ключа должен допускать `NULL`. Метод `createDbTable()` создает столбцы как `NOT NULL`, поэтому для такой таблицы MySQL в строгом режиме вернет ошибку, а в нестрогом режиме запишет в столбец `0`. Если связь нужно удалять, разрешите `NULL` в столбцах `PUBLISHER_ID` и `COVER_ID` при создании таблицы.

**Пример.** Код отвязывает книгу с ID 2 от издательства.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::wakeUpObject(2);
$book->setPublisher(null);
$book->save();
```

Со стороны издательства связи удаляют методы `removeFromBooks()` и `removeAllBooks()`. При сохранении издательства ORM записывает `null` в поле `PUBLISHER_ID` отвязанных книг. Если для поля `BOOKS` задана политика удаления `CascadePolicy::FOLLOW`, ORM удаляет отвязанные книги — подробнее в разделе [Сохранение и удаление связанных объектов](#cascade).

Метод `removeFromBooks()` меняет объект книги, который передан в аргументе. При сохранении издательства ORM сохраняет объект с тем же ID из коллекции `BOOKS`. Поэтому загрузите поле `BOOKS` и передайте в метод объект из коллекции, как в примере ниже. Если коллекция не загружена, ORM сохраняет вместо переданного объекта новый объект книги без изменений и не записывает `null` в поле `PUBLISHER_ID`.

**Пример.** Код выбирает издательство с книгами и отвязывает от него книгу с ID 2.

```php
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::getByPrimary(253, [
    'select' => ['*', 'BOOKS'],
])->fetchObject();

$book = $publisher->getBooks()->getByPrimary(2);

if ($book)
{
    $publisher->removeFromBooks($book);
    $publisher->save();
}
```

Метод `removeAllBooks()` отвязывает все книги издательства. Если поле `BOOKS` не загружено, метод загружает его перед удалением связей.

Методы `removeFrom` и `removeAll` есть только у объектов. Чтобы отвязать книгу без объектов, запишите `null` в поле `PUBLISHER_ID` методом `BookTable::update()`.

#### 6\. Как загрузить поле отношения

Метод `getBooks()` возвращает только загруженные данные. У объекта, созданного методом `wakeUpObject()`, поле `BOOKS` не загружено. Метод `fillBooks()` загружает книги издательства из базы данных и возвращает коллекцию. После загрузки повторный вызов `fillBooks()` не обращается к базе данных. Подробнее о методе `fill` — в разделе [Заполнить объект](./objects.md#fill).

**Пример.** Код создает объект издательства по ID, загружает его книги и выводит их названия.

```php
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::wakeUpObject(253);

foreach ($publisher->fillBooks() as $book)
{
    echo $book->getTitle();
}
// Цикл выведет "Title 1" и "Title 2"
```

## Отношение 1:1, «один к одному»

Отношения 1:1 работают так же, как 1:N, с одним отличием. Для доступа к связи с обеих сторон в каждом классе описывают поле [`Reference`](../api-reference/main/orm/fields/relations/reference/index.md) вместо пары `Reference` и `OneToMany`.

### Пример связи «один к одному»

Рассмотрим пример, где у каждой книги есть уникальная обложка. Это отношение «один к одному», так как одна книга может иметь только одну обложку, и одна обложка принадлежит только одной книге.

#### 1\. Описать сущность Book

Добавьте в карту полей `BookTable` целочисленное поле `COVER_ID`, которое хранит ID обложки книги:

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            new IntegerField('COVER_ID'), // ID обложки книги
        ];
    }
}
```

#### 2\. Описать сущность Cover

Класс `CoverTable` описывает таблицу обложек. Поля сущности:

-  `ID` — первичный ключ с автоинкрементом,

-  `IMAGE_URL` — адрес изображения обложки, строка.

**Пример.** Класс `CoverTable` с полями `ID` и `IMAGE_URL`.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

class CoverTable extends DataManager
{
    public static function getTableName(): string
    {
        return 'my_cover';
    }

    public static function getMap(): array
    {
        return [
            (new IntegerField('ID'))
                ->configurePrimary() // Первичный ключ
                ->configureAutocomplete(), // Автоинкремент

            new StringField('IMAGE_URL'),
        ];
    }
}
```

#### 3\. Настроить связь «один к одному»

Опишите в `BookTable` поле `Reference` с именем `COVER`. Условие соединения связывает поле `COVER_ID` книги с полем `ID` обложки:

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            new IntegerField('COVER_ID'),

            new Reference('COVER', CoverTable::class, Join::on('this.COVER_ID', 'ref.ID')),
        ];
    }
}
```

Чтобы получить книгу через обложку, добавьте обратное поле `Reference` в `CoverTable`. Условие соединения использует то же поле `COVER_ID` книги:

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

class CoverTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Поля ID и IMAGE_URL из предыдущего шага

            new Reference('BOOK', BookTable::class, Join::on('this.ID', 'ref.COVER_ID')),
        ];
    }
}
```

Поле `BOOK` обложки служит для выборки. Метод `setBook()` не меняет поле `COVER_ID` книги. Условие связи ссылается на первичный ключ обложки, а ORM не меняет первичный ключ сохраненного объекта. Связь задавайте со стороны книги методом `setCover()`.

Чтобы выполнить пример, добавьте поле `COVER_ID` в таблицу `my_book` и создайте таблицу `my_cover`. При установке модуля включите `CoverTable` в список создаваемых таблиц. Метод `createDbTable()` не добавляет поля в уже существующую таблицу, поэтому для установленного модуля потребуется отдельно изменить схему базы данных. Чтобы каждая обложка соответствовала не более чем одной книге, создайте уникальное ограничение для `my_book.COVER_ID`.

#### 4\. Получить и задать обложку книги

Методы поля `COVER` работают так же, как методы поля `PUBLISHER` в связи «многие к одному». Метод `getCover()` возвращает обложку, если поле `COVER` загружено. Метод `setCover()` записывает ID обложки в поле `COVER_ID` книги.

**Пример.** Код выбирает книгу с ID 1 вместе с обложкой и выводит адрес изображения.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1, [
    'select' => ['*', 'COVER'],
])->fetchObject();

echo $book->getCover()->getImageUrl();
```

**Пример.** Код привязывает к книге с ID 1 обложку с ID 5.

```php
$cover = \SomePartner\MyBooksCatalog\CoverTable::wakeUpObject(5);

$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;

$book->setCover($cover);
$book->save();
```

## Отношение N:M, «многие ко многим»

Отношение «многие ко многим» описывает поле `ManyToMany`. Поле создает временную сущность для работы с промежуточной таблицей. Эта сущность скрыта от разработчика, через нее ORM добавляет и удаляет связи.

Конструктор `ManyToMany` принимает имя поля и класс связанной сущности. Для простых отношений достаточно вызвать метод `configureTableName` и указать имя таблицы, в которой хранятся связующие данные. Если не задать ни имя таблицы, ни класс сущности-посредника, метод `getMediatorEntity()` поля выбрасывает исключение `Bitrix\Main\ArgumentException` при первом обращении к связи.

Если кроме первичных ключей исходных сущностей есть дополнительные данные, используйте вместо поля `ManyToMany` тип `OneToMany`.

### Пример простых отношений без вспомогательных данных

Рассмотрим пример, где у книги может быть несколько авторов, а у автора — несколько книг. В примере участвуют две сущности — книги `BookTable` и авторы `AuthorTable`.

#### 1\. Описать связь «книга — автор»

Используемые параметры:

-  `AUTHORS` — имя поля, через которое объект книги получает связанных авторов,

-  `AuthorTable::class` — класс таблицы, с которой устанавливается связь,

-  `configureTableName()` — задает имя промежуточной таблицы, которая хранит связи.

```php
// Файл /local/modules/somepartner.mybookscatalog/lib/booktable.php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\ManyToMany;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            (new ManyToMany('AUTHORS', AuthorTable::class))
                ->configureTableName('my_book_author'), // Имя таблицы-связки
        ];
    }
}
```

#### 2\. Описать связь «автор — книга»

Используемые параметры:

-  `BOOKS` — имя поля, через которое объект автора получает связанные книги,

-  `BookTable::class` — класс таблицы, с которой устанавливается связь,

-  `configureTableName()` — задает имя промежуточной таблицы, которая хранит связи.

```php
// Файл /local/modules/somepartner.mybookscatalog/lib/authortable.php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\ManyToMany;

class AuthorTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            (new ManyToMany('BOOKS', BookTable::class))
                ->configureTableName('my_book_author'), // Имя таблицы-связки
        ];
    }
}
```

#### 3\. Создать промежуточную таблицу

Метод `configureTableName()` задает имя промежуточной таблицы, но не создает ее в базе данных. Установщик модуля из статьи [Концепция ORM](./orm-concepts.md#create-table) создает ее через `getMediatorEntity()->createDbTable()`. Если таблица не создается установщиком, для показанной связи с целочисленными первичными ключами создайте ее с двумя столбцами и составным первичным ключом:

```sql
CREATE TABLE my_book_author (
    BOOK_ID INTEGER NOT NULL,
    AUTHOR_ID INTEGER NOT NULL,
    PRIMARY KEY (BOOK_ID, AUTHOR_ID)
);
```

Если в таблице книг есть записи с ID `1` и `2`, а в таблице авторов — с ID `17` и `18`, добавьте связи для примеров выборки ниже:

```sql
INSERT INTO my_book_author (BOOK_ID, AUTHOR_ID) VALUES
    (1, 18),
    (2, 17),
    (2, 18);
```

Пример SQL относится к классам, работающим с реальными таблицами книг и авторов. Если вы задаете имена `MY_BOOK_ID` и `MY_AUTHOR_ID` в следующем примере, эти имена должны быть и у столбцов промежуточной таблицы.

#### 4\. Как выглядит автоматически созданная временная сущность

ORM создает в памяти сущность-посредник для работы с таблицей-связкой. Для поля `AUTHORS` книги класс посредника называется `MediatorFromBookToAuthorViaAuthorsTable`. Имя складывается из имен двух сущностей и имени поля связи. Поле `BOOKS` автора создает для той же таблицы собственного посредника `MediatorFromAuthorToBookViaBooksTable`.

Посредник содержит поля:

-  `BOOK_ID` и `AUTHOR_ID` — первичные ключи книги и автора. Тип поля совпадает с типом первичного ключа исходной сущности,

-  `BOOK` и `AUTHOR` — ссылки [`Reference`](../api-reference/main/orm/fields/relations/reference/index.md) на исходные сущности. Тип соединения ссылок совпадает с типом соединения поля `ManyToMany`, по умолчанию LEFT JOIN.

Описание посредника в виде класса выглядит так:

```php
class MediatorFromBookToAuthorViaAuthorsTable extends DataManager
{
    public static function getTableName(): string
    {
        return 'my_book_author'; // Имя таблицы-связки
    }

    public static function getMap(): array
    {
        return [
            (new IntegerField('BOOK_ID'))
                ->configurePrimary(true),

            new Reference('BOOK', BookTable::class, Join::on('this.BOOK_ID', 'ref.ID')),

            (new IntegerField('AUTHOR_ID'))
                ->configurePrimary(true),

            new Reference('AUTHOR', AuthorTable::class, Join::on('this.AUTHOR_ID', 'ref.ID')),
        ];
    }
}
```

Имена полей посредника ORM формирует из имен сущностей и их первичных ключей:

```text
BOOK_ID    — имя сущности Book в snake_case и верхнем регистре + поле первичного ключа ID
BOOK       — имя сущности Book в snake_case и верхнем регистре
AUTHOR_ID  — имя сущности Author в snake_case и верхнем регистре + поле первичного ключа ID
AUTHOR     — имя сущности Author в snake_case и верхнем регистре
```

#### 5\. Как задать свои имена полей

Если имена столбцов таблицы-связки отличаются от стандартных или первичный ключ сущности состоит из нескольких полей, задайте имена методами поля `ManyToMany`:

-  `configureLocalPrimary($fieldName, $mediatorFieldName)` — связывает поле первичного ключа текущей сущности `$fieldName` со столбцом таблицы-связки `$mediatorFieldName`. Для составного ключа вызовите метод для каждого поля ключа,

-  `configureRemotePrimary($fieldName, $mediatorFieldName)` — связывает поле первичного ключа связанной сущности со столбцом таблицы-связки,

-  `configureLocalReference($name)` — задает имя ссылки посредника на текущую сущность,

-  `configureRemoteReference($name)` — задает имя ссылки посредника на связанную сущность.

**Пример.** Поле `AUTHORS` книги работает с таблицей-связкой, где столбцы называются `MY_BOOK_ID` и `MY_AUTHOR_ID`.

```php
// Файл /local/modules/somepartner.mybookscatalog/lib/booktable.php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\ManyToMany;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            (new ManyToMany('AUTHORS', AuthorTable::class))
                ->configureTableName('my_book_author')
                ->configureLocalPrimary('ID', 'MY_BOOK_ID') // ID книги в таблице-связке
                ->configureLocalReference('MY_BOOK') // Ссылка посредника на книгу
                ->configureRemotePrimary('ID', 'MY_AUTHOR_ID') // ID автора в таблице-связке
                ->configureRemoteReference('MY_AUTHOR'), // Ссылка посредника на автора
        ];
    }
}
```

**Пример.** Поле `BOOKS` автора работает с той же таблицей-связкой. Текущая сущность для этого поля — автор, поэтому локальные и удаленные имена меняются местами.

```php
// Файл /local/modules/somepartner.mybookscatalog/lib/authortable.php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\ManyToMany;

class AuthorTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            (new ManyToMany('BOOKS', BookTable::class))
                ->configureTableName('my_book_author')
                ->configureLocalPrimary('ID', 'MY_AUTHOR_ID') // ID автора в таблице-связке
                ->configureLocalReference('MY_AUTHOR') // Ссылка посредника на автора
                ->configureRemotePrimary('ID', 'MY_BOOK_ID') // ID книги в таблице-связке
                ->configureRemoteReference('MY_BOOK'), // Ссылка посредника на книгу
        ];
    }
}
```

С такими настройками посредник поля `AUTHORS` выглядит так:

```php
class MediatorFromBookToAuthorViaAuthorsTable extends DataManager
{
    public static function getTableName(): string
    {
        return 'my_book_author'; // Имя таблицы-связки
    }

    public static function getMap(): array
    {
        return [
            (new IntegerField('MY_BOOK_ID'))
                ->configurePrimary(true),

            new Reference('MY_BOOK', BookTable::class, Join::on('this.MY_BOOK_ID', 'ref.ID')),

            (new IntegerField('MY_AUTHOR_ID'))
                ->configurePrimary(true),

            new Reference('MY_AUTHOR', AuthorTable::class, Join::on('this.MY_AUTHOR_ID', 'ref.ID')),
        ];
    }
}
```

Метод `configureJoinType()` поля `ManyToMany` задает тип соединения, который ORM передает обеим ссылкам посредника. По умолчанию — LEFT JOIN.

**Пример.** Поле `AUTHORS` с типом соединения INNER JOIN.

```php
use Bitrix\Main\ORM\Fields\Relations\ManyToMany;

(new ManyToMany('AUTHORS', AuthorTable::class))
    ->configureTableName('my_book_author') // Указание имени таблицы-связки
    ->configureJoinType('inner') // Указание типа соединения INNER JOIN
;
```

#### 6\. Как работать с данными

Связи N:M меняют методы `addTo`, `removeFrom` и `removeAll`, как и связи 1:N. При сохранении объекта ORM добавляет или удаляет записи таблицы-связки. Записи книг и авторов остаются в базе данных. Пример добавления связи — в следующем шаге.

**Пример.** Код удаляет связь автора с ID 18 и книги с ID 1. Метод `save()` удаляет запись из таблицы `my_book_author`.

```php
$author = \SomePartner\MyBooksCatalog\AuthorTable::getByPrimary(18)
    ->fetchObject()
;

$book = \SomePartner\MyBooksCatalog\BookTable::wakeUpObject(1);

$author->removeFromBooks($book);
$author->save();
```

Выборка данных:

-  `'select' => ['*', 'AUTHORS']` — выбирает все поля книги и связанных авторов,

-  `getAuthors()` — возвращает коллекцию авторов.

**Пример.** Код выбирает книгу с ID 2 вместе с авторами и выводит их фамилии.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(2, [
    'select' => ['*', 'AUTHORS'] // Выбираем все поля книги и связанных авторов
])->fetchObject();

foreach ($book->getAuthors() as $author)
{
    echo $author->getLastName(); // Выводим фамилию каждого автора
}
// Цикл выведет "Last name 17" и "Last name 18"
```

#### 7\. Связь между объектами сущностей

Связь можно добавить с любой стороны. Метод `save()` объекта, у которого вызван `addTo`, добавляет запись в таблицу-связку.

**Пример.** Код добавляет связь со стороны автора — книгу с ID 1 к автору с ID 17.

```php
$author = \SomePartner\MyBooksCatalog\AuthorTable::getByPrimary(17)
    ->fetchObject() // Получаем объект автора с ID 17
;

$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject() // Получаем объект книги с ID 1
;

$author->addToBooks($book); // Добавляем книгу к автору
$author->save(); // Сохраняем изменения
```

**Пример.** Код добавляет ту же связь со стороны книги — автора с ID 17 к книге с ID 1. Выполните один из двух примеров — оба добавляют одну и ту же запись в таблицу-связку.

```php
$author = \SomePartner\MyBooksCatalog\AuthorTable::getByPrimary(17)
    ->fetchObject() // Получаем объект автора с ID 17
;

$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject() // Получаем объект книги с ID 1
;

$book->addToAuthors($author); // Добавляем автора к книге
$book->save(); // Сохраняем изменения
```

### Пример отношений со вспомогательными данными

Когда есть дополнительные данные, отношение следует описывать отдельной сущностью. Например, кроме первичных ключей исходных сущностей `STORE_ID` и `BOOK_ID` есть еще количество книг `QUANTITY`.

#### 1\. Промежуточная таблица

Поля промежуточной сущности `StoreBookTable`:

-  `STORE_ID` и `BOOK_ID` — первичные ключи из таблиц `StoreTable` и `BookTable`,

-  `QUANTITY` — дополнительное поле для хранения количества книг.

**Пример.** Класс `StoreBookTable` с составным первичным ключом из полей `STORE_ID` и `BOOK_ID`.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\Relations\Reference; // Импорт класса Reference для создания ссылок на другие таблицы
use Bitrix\Main\ORM\Query\Join; // Импорт класса Join для определения условий соединения

// Класс StoreBookTable наследует DataManager для работы с данными
class StoreBookTable extends DataManager
{
    // Метод для получения имени таблицы
    public static function getTableName(): string
    {
        return 'my_store_book'; // Имя таблицы, которая хранит данные о книгах в магазинах
    }

    // Метод для определения карты полей таблицы
    public static function getMap(): array
    {
        return [
            // Определение поля STORE_ID как первичного ключа
            (new IntegerField('STORE_ID'))
                ->configurePrimary(true),

            // Определение ссылки на таблицу StoreTable
            (new Reference('STORE', StoreTable::class,
                Join::on('this.STORE_ID', 'ref.ID')))
                ->configureJoinType('inner'),

            // Определение поля BOOK_ID как первичного ключа
            (new IntegerField('BOOK_ID'))
                ->configurePrimary(true),

            // Определение ссылки на таблицу BookTable
            (new Reference('BOOK', BookTable::class,
                Join::on('this.BOOK_ID', 'ref.ID')))
                ->configureJoinType('inner'),

            // Определение поля QUANTITY для хранения количества книг
            (new IntegerField('QUANTITY'))
                ->configureDefaultValue(0) // Установка значения по умолчанию
        ];
    }
}
```

Поле `ManyToMany` может работать через описанную сущность-посредник. Для этого передайте ее класс в метод `configureMediatorEntity()`. Имена ссылок посредника по умолчанию — `BOOK` и `STORE`, они совпадают с полями `StoreBookTable`. Если имена другие, задайте их методами `configureLocalReference()` и `configureRemoteReference()`.

Такое поле не дает доступа к вспомогательным данным, таким как `QUANTITY`. Метод `addToStores()` добавляет запись со значением `QUANTITY` по умолчанию, метод `removeFromStores()` удаляет запись. Изменить количество через поле `ManyToMany` нельзя.

**Пример.** Поле `STORES` книги работает через сущность `StoreBookTable`.

```php
use Bitrix\Main\ORM\Fields\Relations\ManyToMany;

// В методе getMap класса BookTable
(new ManyToMany('STORES', StoreTable::class))
    ->configureMediatorEntity(StoreBookTable::class),
```

#### 2\. Как работать со вспомогательными данными

Для работы со вспомогательными данными используйте объекты промежуточной сущности `StoreBookTable`.

**Пример.** Код создает запись о наличии книги с ID 1 в магазине с ID 34 в количестве пяти штук.

```php
// Объект книги
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
// Объект магазина
$store = \SomePartner\MyBooksCatalog\StoreTable::getByPrimary(34)
    ->fetchObject()
;
// Новый объект связи книги с магазином
$item = \SomePartner\MyBooksCatalog\StoreBookTable::createObject()
    ->setBook($book)
    ->setStore($store)
    ->setQuantity(5)
;
// Сохранение
$item->save();
```

**Пример.** Код меняет количество книги с ID 2 в магазине с ID 33. Первичный ключ `StoreBookTable` составной, поэтому `getByPrimary()` получает массив с ключами `STORE_ID` и `BOOK_ID`.

```php
// Объект существующей связи
$item = \SomePartner\MyBooksCatalog\StoreBookTable::getByPrimary([
    'STORE_ID' => 33,
    'BOOK_ID' => 2,
])->fetchObject();
// Обновление количества
$item->setQuantity(12);
// Сохранение
$item->save();
```

**Пример.** Код удаляет запись о наличии книги с ID 2 в магазине с ID 33.

```php
// Объект существующей связи
$item = \SomePartner\MyBooksCatalog\StoreBookTable::getByPrimary([
    'STORE_ID' => 33,
    'BOOK_ID' => 2,
])->fetchObject();
// Удаление
$item->delete();
```

Без объектов используйте методы `add()`, `update()` и `delete()` класса `StoreBookTable`. Первичный ключ передавайте массивом с ключами `STORE_ID` и `BOOK_ID`:

```php
// Добавление записи
\SomePartner\MyBooksCatalog\StoreBookTable::add([
    'STORE_ID' => 34,
    'BOOK_ID' => 1,
    'QUANTITY' => 5,
]);
// Обновление записи
\SomePartner\MyBooksCatalog\StoreBookTable::update(
    ['STORE_ID' => 34, 'BOOK_ID' => 1],
    ['QUANTITY' => 12]
);
// Удаление записи
\SomePartner\MyBooksCatalog\StoreBookTable::delete(
    ['STORE_ID' => 34, 'BOOK_ID' => 1]
);
```

В случае со вспомогательными данными используйте вместо поля `ManyToMany` тип `OneToMany`:

```php
// Файл /local/modules/somepartner.mybookscatalog/lib/booktable.php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\OneToMany;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            // BOOK — поле Reference в StoreBookTable, которое указывает на книгу
            new OneToMany('STORE_ITEMS', StoreBookTable::class, 'BOOK'),
        ];
    }
}
```

Со стороны магазина опишите связь так же:

```php
// Файл /local/modules/somepartner.mybookscatalog/lib/storetable.php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\Relations\OneToMany;

class StoreTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // Остальные поля сущности

            // STORE — поле Reference в StoreBookTable, которое указывает на магазин
            new OneToMany('BOOK_ITEMS', StoreBookTable::class, 'STORE'),
        ];
    }
}
```

**Пример.** Код выбирает книгу с ID 1 вместе с записями о наличии в магазинах. Метод `getStoreItems()` возвращает коллекцию объектов промежуточной сущности `StoreBookTable`, а не магазинов.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1, [
    'select' => ['*', 'STORE_ITEMS'] // Выбираем все поля книги и связанные записи о наличии в магазинах
])->fetchObject();

foreach ($book->getStoreItems() as $storeItem) // Перебираем все связанные записи о наличии книги в магазинах
{
    printf(
        'store "%s" has %s of book "%s"', // Форматируем строку для вывода информации
        $storeItem->getStoreId(), // Получаем ID магазина
        $storeItem->getQuantity(), // Получаем количество книг в магазине
        $storeItem->getBookId() // Получаем ID книги
    );
    // Пример вывода: store "33" has 4 of book "1"
}
```

## Сохранение и удаление связанных объектов {#cascade}

Методы `save()` и `delete()` объекта обрабатывают не только его запись, но и поля отношений. При удалении поведение задает политика каскадного удаления поля. При сохранении поведение одинаково для всех полей отношений.

### Сохранение

Метод `save()` сначала записывает изменения самого объекта, затем сохраняет связанные объекты:

-  объект из поля `Reference`, если он загружен или задан сеттером,

-  все объекты коллекций `OneToMany` и `ManyToMany`,

-  добавленные и удаленные связи `ManyToMany` — как записи таблицы-связки.

Связанный объект без изменений запрос на обновление не выполняет.

У полей отношений есть метод `configureCascadeSavePolicy()`. Метод принимает константу класса `CascadePolicy` и сохраняет ее в поле, но метод `save()` это значение не учитывает. Отключить сохранение связанных объектов этим методом нельзя.

### Удаление

Метод `configureCascadeDeletePolicy()` поля отношения задает, что метод `delete()` делает со связанными объектами. Метод принимает константу класса `Bitrix\Main\ORM\Fields\Relations\CascadePolicy`:

-  `CascadePolicy::NO_ACTION` — не менять связанные объекты,

-  `CascadePolicy::SET_NULL` — записать `null` в поле ссылки связанных объектов,

-  `CascadePolicy::FOLLOW` — удалить связанные объекты,

-  `CascadePolicy::FOLLOW_ORPHANS` — константа есть в классе, но метод `delete()` ее не обрабатывает.

Политика по умолчанию и ее действие зависят от типа поля.

| Поле | Политика по умолчанию | Что делает `delete()` |
|---|---|---|
| `Reference` | `NO_ACTION` | С политикой `FOLLOW` вызывает `delete()` у связанного объекта. С остальными политиками не меняет связанный объект |
| `OneToMany` | `SET_NULL` | С политикой `SET_NULL` записывает `null` в поле `Reference` связанных объектов. С политикой `FOLLOW` загружает коллекцию и удаляет каждый объект. С политикой `NO_ACTION` не меняет связанные объекты |
| `ManyToMany` | `NO_ACTION` | Удаляет записи таблицы-связки при любой политике. Связанные объекты остаются в базе данных |

Для `Reference` с политикой `FOLLOW` метод `delete()` берет связанный объект из значения поля и не загружает его из базы данных. Если поле не загружено, вызов завершится ошибкой PHP. Перед удалением загрузите поле, например методом `fillPublisher()`.

Политика `FOLLOW` у поля `OneToMany` действует и на методы `removeFrom` и `removeAll`. При сохранении объекта ORM удаляет отвязанные объекты, а не записывает `null` в их поле ссылки.

Политика `SET_NULL` не отвязывает объекты, у которых поле ссылки входит в первичный ключ. Например, поле `BOOK_ID` входит в первичный ключ `StoreBookTable`, а ORM не меняет первичный ключ сохраненного объекта. После удаления книги записи о ее наличии в магазинах останутся в таблице. Чтобы удалять их вместе с книгой, задайте полю `STORE_ITEMS` политику `FOLLOW`.

**Пример.** Поле `STORE_ITEMS` книги удаляет записи о наличии вместе с книгой.

```php
use Bitrix\Main\ORM\Fields\Relations\CascadePolicy;
use Bitrix\Main\ORM\Fields\Relations\OneToMany;

// В методе getMap класса BookTable
(new OneToMany('STORE_ITEMS', StoreBookTable::class, 'BOOK'))
    ->configureCascadeDeletePolicy(CascadePolicy::FOLLOW),
```

Как проверить результат удаления и какие события срабатывают, читайте в разделе «Удалить объект» статьи [Объекты](./objects.md).

## Что дальше

-  [Объекты](./objects.md) — методы `addTo`, `removeFrom`, `removeAll`, сохранение и удаление объектов,

-  [Коллекции](./collections.md) — работа со значениями полей `OneToMany` и `ManyToMany`,

-  [Выборка данных](./querying-data.md) — выборка связанных данных и условия соединения таблиц,

-  [Концепция ORM](./orm-concepts.md#create-table) — создание таблиц сущностей и таблицы-связки при установке модуля,

-  [Аннотации классов](./annotations.md) — классы `EO_*` и подсказки IDE для методов объектов.
