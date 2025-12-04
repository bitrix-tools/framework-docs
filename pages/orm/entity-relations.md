---
title: Отношения между сущностями
description: 'Отношения между сущностями. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

В ORM отношения между сущностями описывают, как данные одной таблицы связаны с данными другой.  Основные типы отношений:

-  1:1, «один к одному». Каждая запись в первой таблице соответствует одной записи во второй таблице.

-  1:N, «один ко многим». Одна запись в первой таблице может быть связана с несколькими записями во второй таблице.

-  N:M, «многие ко многим». Записи в первой таблице могут быть связаны с несколькими записями во второй таблице и наоборот.

## Пример схемы отношений

Рассмотрим пример с сущностями: книга `Book`, автор `Author`, издательство `Publisher`, обложка `Cover` и магазин `Store`. Схема отношений сущностей:

-  книга принадлежит одному издательству,

-  у книги может быть несколько авторов,

-  одна книга может иметь только одну обложку, и одна обложка принадлежит только одной книге,

-  книга продается в нескольких магазинах.

## Отношение 1:N, «один ко многим»

Одна запись в таблице может соответствовать множеству записей в другой. В Bitrix Framework для описания таких связей используются специальные конструкторы:

-  `Reference` для связи «многие к одному»,

-  `OneToMany` для связи «один ко многим».

Параметры конструктора `Reference`:

-  `$name` -- имя поля,

-  `$referenceEntity` -- класс связываемой сущности,

-  `$referenceFilter` -- условия джойна, то есть объединения таблиц. Используются префиксы `this.` и `ref.` для указания принадлежности к текущей и связываемой сущности. Доступные типы джойнов: INNER JOIN, LEFT JOIN, RIGHT JOIN. По умолчанию используется LEFT JOIN. Для изменения типа джойна используйте метод `configureJoinType`. Параметр необязательный и служит для добавления дополнительных условий фильтрации при соединении таблиц.

Параметры конструктора `OneToMany`:

-  `$name` -- имя поля,

-  `$referenceEntity` -- класс связываемой сущности,

-  `$referenceFilter` -- имя поля `Reference` в сущности-партнере.

### Пример связи «многие к одному»

Каждая книга издается в одном издательстве, что создает отношение «N книг -- 1 издательство». Для реализации этой связи необходимо:

-  добавить поле `PUBLISHER_ID` в таблицу книг,

-  создать связь между таблицами книг и издательств.

#### 1\. Определить поле `PUBLISHER_ID`

Добавим поле `PUBLISHER_ID` в класс `BookTable`. Это поле будет указывать на конкретное издательство.

`PUBLISHER_ID` -- это внешний ключ, связывающий таблицу книг с таблицей издательств.

```php
namespace Bitrix\Main\Test\Typography;

use Bitrix\Main\ORM\Fields\IntegerField;

class BookTable extends \Bitrix\Main\ORM\Data\DataManager
{
    public static function getMap()
    {
        return [
            new IntegerField('PUBLISHER_ID'), // Поле PUBLISHER_ID, целочисленное
        ];
    }
}
```

#### 2\. Определить связь «многие к одному»

Для описания связи «книги -- издательство» используем класс `Reference` из пространства имен `Bitrix\Main\ORM\Fields\Relations`. Этот класс позволяет связать две таблицы по определенному условию.

Условие соединения `Join::on` указывает, что поле `PUBLISHER_ID` в таблице книг должно соответствовать полю `ID` в таблице издательств.

```php
namespace Bitrix\Main\Test\Typography;

use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

class BookTable extends \Bitrix\Main\ORM\Data\DataManager
{
    public static function getMap()
    {
        return [
            new IntegerField('PUBLISHER_ID'), // Поле PUBLISHER_ID, целочисленное

            // Определение связи с таблицей PublisherTable
            new Reference(
                'PUBLISHER', // Имя связи
                PublisherTable::class, // Класс связанной таблицы
                Join::on('this.PUBLISHER_ID', 'ref.ID') // Условие соединения: связывает PUBLISHER_ID с ID в PublisherTable
            )->configureJoinType('inner'), // Установка типа соединения: INNER JOIN
        ];
    }
}
```

#### 3\. Получить объект издательства через книгу

Чтобы получить объект сущности `Publisher` через объект `Book`, используем метод `getPublisher()`. Этот метод автоматически загружает связанное издательство.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1, [
    'select' => ['*', 'PUBLISHER'], // Выбор всех полей книги и связанных данных издательства
])->fetchObject();

echo $book->getPublisher()->getTitle(); // Вывод названия издательства
// Ожидаемый вывод: Publisher Title 253
```

#### 4\. Установить связь между книгой и издательством

Чтобы установить связь между книгой и издательством, передадим объект `Publisher` в сеттер `setPublisher()`. Значение поля `PUBLISHER_ID` заполнится автоматически.

```php
// Инициализация объекта издательства
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::wakeUpObject(253); 
// Метод wakeUpObject создает объект с заданным первичным ключом без загрузки данных из базы

// Инициализация объекта книги
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)->fetchObject();
// Метод getByPrimary загружает объект книги с первичным ключом 1 из базы данных

// Установка значения объекта издательства для книги
$book->setPublisher($publisher);
// Метод setPublisher устанавливает связь между книгой и издательством

// Сохранение изменений в базе данных
$book->save();
// Метод save сохраняет изменения в объекте книги, включая обновленную связь с издательством
```

#### 5\. Результат для массивов

Если требуется получить данные в виде массива, результат будет содержать все поля книги и связанные данные издательства.

```php
$result = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1, [
    'select' => ['*', 'PUBLISHER'], // Выбор всех полей книги и связанных данных издательства
]);

print_r($result->fetch());
/* Выведет:
Array (
    [ID] => 1
    [TITLE] => Title 1
    [PUBLISHER_ID] => 253
    [ISBN] => 978-3-16-148410-0
    [IS_ARCHIVED] => Y
    [MAIN_TEST_TYPOGRAPHY_BOOK_PUBLISHER_ID] => 253
    [MAIN_TEST_TYPOGRAPHY_BOOK_PUBLISHER_TITLE] => Publisher Title 253
)
*/
```

#### 6\. Как использовать алиасы для полей

По умолчанию поля связанной сущности получают уникальные имена, основанные на пространстве имен и имени класса. Чтобы сделать имена более короткими и удобными, можно использовать алиасы. Например, вместо `MAIN_TEST_TYPOGRAPHY_BOOK_PUBLISHER_TITLE` можно использовать `PUB_TITLE`.

```php
$result = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1, [
    'select' => ['*', 'PUB_' => 'PUBLISHER'], // Поля издательства будут представлены в виде алиасов с префиксом PUB_
]);

print_r($result->fetch());
/* Выведет:
Array (
    [ID] => 1
    [TITLE] => Title 1
    [PUBLISHER_ID] => 253
    [ISBN] => 978-3-16-148410-0
    [IS_ARCHIVED] => Y
    [PUB_ID] => 253
    [PUB_TITLE] => Publisher Title 253
)
*/
```

### Пример связи «один ко многим»

Для двунаправленной связи «один ко многим» рассмотрим пример взаимодействия между двумя таблицами: издательство `Publisher` и книги `Book`. Каждое издательство может иметь множество книг, что соответствует типу связи `OneToMany`.

#### 1\. Определить класс PublisherTable

Создадим класс `PublisherTable`, который представляет собой таблицу издательств в базе данных. Этот класс наследуется от `DataManager` -- основного класса для работы с данными в Bitrix Framework.

```php
namespace Bitrix\Main\Test\Typography; 
use Bitrix\Main\ORM\Data\DataManager; // Импорт класса DataManager для работы с данными
use Bitrix\Main\ORM\Fields\Relations\OneToMany; // Импорт класса OneToMany для создания связей «один ко многим»

class PublisherTable extends DataManager // Класс PublisherTable наследует DataManager для работы с данными
{
    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение связи «один ко многим» с таблицей BookTable
            (new OneToMany('BOOKS', BookTable::class, 'PUBLISHER'))
                ->configureJoinType('inner') // Установка типа соединения: INNER JOIN
        ];
    }
}
```

#### 2\. Выбрать данные через связь

Используем связь, чтобы получить данные из таблицы издательств и связанных с ними книг.

Метод `getByPrimary` возвращает запись по первичному ключу  -- в данном случае `ID=253`.

Цикл `foreach` проходит по всем книгам, связанным с текущим издательством, и выводит их названия.

```php
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::getByPrimary(253, [
    'select' => ['*', 'BOOKS'] // Выбор всех полей издательства и связанных данных книг
])->fetchObject();

// Перебор всех книг, связанных с издательством
foreach ($publisher->getBooks() as $book) {
    echo $book->getTitle(); // Вывод названия каждой книги
}
// Цикл выведет "Title 1" и "Title 2"
```

В объектной модели все связанные данные автоматически объединяются в одну коллекцию. Например, если у издательства есть две книги, результат будет представлен в виде одного объекта, содержащего коллекцию этих книг.

#### 3\. Получить данные в виде массива

Если запросить данные в виде массива, то результат будет содержать дублирование данных об издательстве для каждой связанной книги.

```php
$data = \Bitrix\Main\Test\Typography\PublisherTable::getByPrimary(253, [
    'select' => ['*', 'BOOK_' => 'BOOKS'] // Выбор всех полей издательства и связанных данных книг с префиксом
])->fetchAll();

// Вернет
Array (
	[0] => Array (
		[ID] => 253
		[TITLE] => Publisher Title 253
		[BOOK_ID] => 2
		[BOOK_TITLE] => Title 2
		[BOOK_PUBLISHER_ID] => 253
		[BOOK_ISBN] => 456-1-05-586920-1
		[BOOK_IS_ARCHIVED] => N 
	) 
	[1] => Array (
		[ID] => 253
		[TITLE] => Publisher Title 253
		[BOOK_ID] => 1
		[BOOK_TITLE] => Title 1
		[BOOK_PUBLISHER_ID] => 253
		[BOOK_ISBN] => 978-3-16-148410-0
		[BOOK_IS_ARCHIVED] => Y
	)
)
```

#### 4\. Как добавить объект

Чтобы добавить новую книгу в коллекцию книг издательства, используйте метод `addToBooks`. Этот метод добавляет существующую книгу в коллекцию. Если книги еще нет в базе данных, она должна быть создана заранее.

```php
// Инициализация объекта издательства
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::getByPrimary(253)
    ->fetchObject();
// Метод getByPrimary загружает объект издательства с первичным ключом 253 из базы данных

// Инициализация объекта книги
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(2)
    ->fetchObject();
// Метод getByPrimary загружает объект книги с первичным ключом 2 из базы данных

// Добавление книги в коллекцию книг издательства
$publisher->addToBooks($book);
// Метод addToBooks добавляет объект книги в коллекцию книг, связанных с издательством

// Сохранение изменений в базе данных
$publisher->save();
// Метод save сохраняет изменения в объекте издательства, включая обновленную коллекцию книг
```

Для работы с массивами необходимо использовать стандартный метод ORM `add`.

#### 5\. Как удалить связь

Чтобы удалить связь со стороны книги, используйте метод `setPublisher(null)` для разрыва связи между книгой и издательством. Это не удаляет книгу из базы данных.

Чтобы удалить связь со стороны издательства, используйте методы `removeFromBooks` или `removeAllBooks`.

```php
// Инициализация объекта книги
$book = \Bitrix\Main\Test\Typography\Book::wakeUp(2);
// Метод wakeUp создает объект книги с заданным идентификатором без загрузки данных из базы

// Инициализация объекта издательства
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::getByPrimary(253, [
    'select' => ['*', 'BOOKS'] // Выбор всех полей издательства и связанных данных книг
])->fetchObject();

// Удаление одной конкретной книги из коллекции книг издательства
$publisher->removeFromBooks($book);
// Метод removeFromBooks удаляет связь между издательством и указанной книгой

// Удаление всех книг из коллекции книг издательства
$publisher->removeAllBooks();
// Метод removeAllBooks удаляет все связи между издательством и его книгами

// Сохранение изменений в базе данных
$publisher->save();
// Метод save сохраняет изменения в объекте издательства, обновляя поле PUBLISHER_ID в книгах на пустое значение
```

Операции `removeFrom` и `removeAll` недоступны для массивов, потому что они требуют объектной модели для управления связями. Для работы с массивами необходимо использовать стандартные методы ORM `update` и `delete`.

#### 6\. Как проверить заполнение поля отношений

Если вы не уверены, что поле отношений уже загружено, используйте метод `fill`.

```php
// Инициализация объекта книги
$book = \Bitrix\Main\Test\Typography\BookTable::wakeUpObject(2);
// Метод wakeUpObject создает объект книги с заданным идентификатором без загрузки данных из базы

// Инициализация объекта издательства с заполнением только первичного ключа
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::wakeUpObject(253);
// Метод wakeUpObject создает объект издательства с заданным идентификатором без загрузки данных из базы

// Заполнение поля отношения книг
$publisher->fillBooks();
// Метод fillBooks загружает связанные книги для данного издательства

// Удаление конкретной книги из коллекции книг издательства
$publisher->removeFromBooks($book);
// Метод removeFromBooks удаляет связь между издательством и указанной книгой

// Удаление всех книг из коллекции книг издательства
$publisher->removeAllBooks();
// Метод removeAllBooks удаляет все связи между издательством и его книгами

// Сохранение изменений в базе данных
$publisher->save();
// Метод save сохраняет изменения в объекте издательства, обновляя поле PUBLISHER_ID в книгах на пустое значение
```

## Отношение 1:1, «один к одному»

Отношения 1:1 работают так же, как и 1:N, но с одним отличием: в обеих сущностях вместо пары `Reference + OneToMany` используются только поля `Reference`.

### Пример связи «один к одному»

Рассмотрим пример, где у каждой книги есть уникальная обложка. Это отношение «один к одному», так как одна книга может иметь только одну обложку, и одна обложка принадлежит только одной книге.

#### 1\. Описать сущность Book

Класс `BookTable` представляет таблицу книг в базе данных. Он содержит следующие поля:

-  `ID` -- первичный ключ таблицы, который автоматически заполняется при создании новой записи,

-  `TITLE` -- строка, содержащая название книги,

-  `COVER_ID` -- целое число, которое будет использоваться для связи с таблицей обложек `CoverTable`.

```php
namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Data\DataManager; 
use Bitrix\Main\ORM\Fields\IntegerField; 
use Bitrix\Main\ORM\Fields\StringField; 

class BookTable extends DataManager // Класс BookTable наследует DataManager для работы с данными
{
    // Метод для получения имени таблицы
    public static function getTableName()
    {
        return 'b_book'; // Имя таблицы, которая хранит данные о книгах
    }

    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение поля ID как первичного ключа с автозаполнением
            (new IntegerField('ID'))
                ->configurePrimary(true) // Устанавливает поле как первичный ключ
                ->configureAutocomplete(true), // Включает автозаполнение

            // Определение обязательного строкового поля TITLE
            (new StringField('TITLE'))
                ->configureRequired(true), // Устанавливает поле как обязательное

            // Определение целочисленного поля COVER_ID
            (new IntegerField('COVER_ID'))
            // Это поле может использоваться как ссылка на обложку книги
        ];
    }
}
```

#### 2\. Описать сущность Cover

Класс `CoverTable` представляет таблицу обложек в базе данных. Он содержит следующие поля:

-  `ID` -- первичный ключ таблицы, который автоматически заполняется при создании новой записи,

-  `IMAGE_URL` -- строка, содержащая URL изображения обложки.

```php
namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Data\DataManager; 
use Bitrix\Main\ORM\Fields\IntegerField; 
use Bitrix\Main\ORM\Fields\StringField; 

class CoverTable extends DataManager // Класс CoverTable наследует DataManager для работы с данными
{
    // Метод для получения имени таблицы
    public static function getTableName()
    {
        return 'b_cover'; // Имя таблицы, которая хранит данные об обложках
    }

    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение поля ID как первичного ключа с автозаполнением
            (new IntegerField('ID'))
                ->configurePrimary(true) // Устанавливает поле как первичный ключ
                ->configureAutocomplete(true), // Включает автозаполнение для поля

            // Определение строкового поля IMAGE_URL
            (new StringField('IMAGE_URL'))
            // Это поле хранит URL изображения обложки
        ];
    }
}
```

#### 3\. Настроить связь «один к одному»

Для связи «один к одному» между таблицами `BookTable` и `CoverTable` используется поле `Reference`. Это поле позволяет создать связь между таблицами через указанные условия соединения.

```php
namespace Bitrix\Main\Test\Typography; 
use Bitrix\Main\ORM\Fields\Relations\Reference; // Импорт класса Reference для создания связей между таблицами
use Bitrix\Main\ORM\Query\Join; // Импорт класса Join для определения условий соединения

class BookTable extends DataManager // Класс BookTable наследует DataManager для работы с данными
{
    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение поля ID как первичного ключа с автозаполнением
            (new IntegerField('ID'))
                ->configurePrimary(true) // Устанавливает поле как первичный ключ
                ->configureAutocomplete(true), // Включает автозаполнение для поля

            // Определение обязательного строкового поля TITLE
            (new StringField('TITLE'))
                ->configureRequired(true), // Устанавливает поле как обязательное

            // Определение целочисленного поля COVER_ID
            (new IntegerField('COVER_ID')),
            // Это поле используется как ссылка на обложку

            // Определение связи с таблицей CoverTable
            (new Reference(
                'COVER', // Имя связи
                CoverTable::class, // Класс таблицы, с которой устанавливается связь
                Join::on('this.COVER_ID', 'ref.ID') // Условие соединения: связывает COVER_ID с ID в CoverTable
            ))
                ->configureJoinType('inner') // Устанавливает тип соединения как внутреннее (inner join)
            // Это означает, что будут выбраны только те записи, у которых есть соответствующая обложка
        ];
    }
}
```

## Отношение N:M, «многие ко многим»

Для описания отношения «многие ко многим» используется поле `ManyToMany`, которое автоматически создает временную сущность для работы с промежуточной таблицей. Эта сущность скрыта от пользователя, но позволяет добавлять, удалять и обновлять связи.

В конструктор `ManyToMany` передаются название поля и класс партнерской сущности. Для простых отношений достаточно вызвать метод `configureTableName` и указать имя таблицы, в которой хранятся связующие данные.

Если кроме первичных ключей исходных сущностей есть дополнительные данные, используйте вместо поля `ManyToMany` тип `OneToMany`.

### Пример простых отношений без вспомогательных данных

Рассмотрим пример, где у книги может быть несколько авторов, а у автора -- несколько книг. Для этого создадим две таблицы: книги `BookTable` и авторы `AuthorTable`.

#### 1\. Описать связь «книга -- автор»

Используемые параметры:

-  `AUTHORS` -- имя свойства, через которое будет осуществляться доступ к связанным авторам,

-  `AuthorTable::class` -- класс таблицы, с которой устанавливается связь,

-  `configureTableName('b_book_author')` -- имя промежуточной таблицы, хранящей связи.

```php
//Файл bitrix/modules/main/lib/test/typography/booktable.php

namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Fields\Relations\ManyToMany; // Импорт класса ManyToMany для создания связей «многие ко многим»

class BookTable extends \Bitrix\Main\ORM\Data\DataManager // Класс BookTable наследует DataManager для работы с данными
{
    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение связи «многие ко многим» с таблицей AuthorTable
            (new ManyToMany('AUTHORS', AuthorTable::class))
                ->configureTableName('b_book_author') // Указание имени таблицы-связки
        ];
    }
}
```

#### 2\. Описать связь «автор -- книга»

Используемые параметры:

-  `BOOKS` -- имя свойства, через которое будет осуществляться доступ к связанным книгам,

-  `BookTable::class` -- класс таблицы, с которой устанавливается связь,

-  `configureTableName('b_book_author')` -- имя промежуточной таблицы, хранящей связи.

```php
//Файл bitrix/modules/main/lib/test/typography/authortable.php

namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Fields\Relations\ManyToMany; // Импорт класса ManyToMany для создания связей «многие ко многим»

class AuthorTable extends \Bitrix\Main\ORM\Data\DataManager // Класс AuthorTable наследует DataManager для работы с данными
{
    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение связи «многие ко многим» с таблицей BookTable
            (new ManyToMany('BOOKS', BookTable::class))
                ->configureTableName('b_book_author') // Указание имени таблицы-связки
        ];
    }
}
```

#### 3\. Как выглядит автоматически созданная временная сущность

В памяти автоматически создается временная сущность для работы с промежуточной таблицей. Это типовая сущность с направленными отношениями 1:N к исходным сущностям-партнерам, где:

-  `BOOK_ID` и `AUTHOR_ID` -- первичные ключи из таблиц `BookTable` и `AuthorTable`,

-  `Reference` -- ссылки на исходные таблицы.

```php
class ... extends \Bitrix\Main\ORM\Data\DataManager
{
    // Метод для получения имени таблицы
    public static function getTableName()
    {
        return 'b_book_author'; // Имя таблицы-связки
    }

    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение поля BOOK_ID как первичного ключа
            (new IntegerField('BOOK_ID'))
                ->configurePrimary(true),

            // Определение ссылки на таблицу BookTable
            (new Reference('BOOK', BookTable::class,
                Join::on('this.BOOK_ID', 'ref.ID')))
                ->configureJoinType('inner'),

            // Определение поля AUTHOR_ID как первичного ключа
            (new IntegerField('AUTHOR_ID'))
                ->configurePrimary(true),

            // Определение ссылки на таблицу AuthorTable
            (new Reference('AUTHOR', AuthorTable::class,
                Join::on('this.AUTHOR_ID', 'ref.ID')))
                ->configureJoinType('inner'),
        ];
    }
}
```

Имена полей формируются на основе имен сущностей и их первичных ключей.

```php
new IntegerField('BOOK_ID') - snake_case от Book + primary поле ID
new Reference('BOOK') - snake_case от Book
new IntegerField('AUTHOR_ID') - snake_case от Author + primary поле ID
new Reference('AUTHOR') - snake_case от Author
```

#### 3\. Как явно задать имена полей

Если необходимо явно задать имена полей или работать со сложными первичными ключами, используйте конфигурирующие методы `configure`.

Метод `configureLocalPrimary` указывает, как будет называться привязка к полю из первичного ключа текущей сущности. Аналогично, `configureRemotePrimary` задает соответствие полей первичного ключа сущности-партнера. Методы `configureLocalReference` и `configureRemoteReference` задают имена референсов к исходным сущностям.

Описание связи «книга -- автор»:

```php
//Файл bitrix/modules/main/lib/test/typography/booktable.php
namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Fields\Relations\ManyToMany; // Импорт класса ManyToMany для создания связей «многие ко многим»

class BookTable extends \Bitrix\Main\ORM\Data\DataManager // Класс BookTable наследует DataManager для работы с данными
{
    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение связи "многие ко многим" с таблицей AuthorTable
            (new ManyToMany('AUTHORS', AuthorTable::class))
                ->configureTableName('b_book_author') // Указание имени таблицы-связки
                ->configureLocalPrimary('ID', 'MY_BOOK_ID') // Указание локального первичного ключа и его соответствия в таблице-связке
                ->configureLocalReference('MY_BOOK') // Указание локальной ссылки
                ->configureRemotePrimary('ID', 'MY_AUTHOR_ID') // Указание удаленного первичного ключа и его соответствия в таблице-связке
                ->configureRemoteReference('MY_AUTHOR') // Указание удаленной ссылки
        ];
    }
}
```

Описание связи «автор -- книга»:

```php
//Файл bitrix/modules/main/lib/test/typography/authortable.php
namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Fields\Relations\ManyToMany; // Импорт класса ManyToMany для создания связей «многие ко многим»

class AuthorTable extends \Bitrix\Main\ORM\Data\DataManager // Класс AuthorTable наследует DataManager для работы с данными
{
    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение связи «многие ко многим» с таблицей BookTable
            (new ManyToMany('BOOKS', BookTable::class))
                ->configureTableName('b_book_author') // Указание имени таблицы-связки
                ->configureLocalPrimary('ID', 'MY_AUTHOR_ID') // Указание локального первичного ключа и его соответствия в таблице-связке
                ->configureLocalReference('MY_AUTHOR') // Указание локальной ссылки
                ->configureRemotePrimary('ID', 'MY_BOOK_ID') // Указание удаленного первичного ключа и его соответствия в таблице-связке
                ->configureRemoteReference('MY_BOOK') // Указание удаленной ссылки
        ];
    }
}
```

Системная сущность отношений:

```php
class ... extends \Bitrix\Main\ORM\Data\DataManager
{
    // Метод для получения имени таблицы
    public static function getTableName()
    {
        return 'b_book_author'; // Имя таблицы-связки
    }

    // Метод для определения карты полей таблицы
    public static function getMap()
    {
        return [
            // Определение поля MY_BOOK_ID как первичного ключа
            (new IntegerField('MY_BOOK_ID'))
                ->configurePrimary(true),

            // Определение ссылки на таблицу BookTable
            (new Reference('MY_BOOK', BookTable::class,
                Join::on('this.MY_BOOK_ID', 'ref.ID')))
                ->configureJoinType('inner'),

            // Определение поля MY_AUTHOR_ID как первичного ключа
            (new IntegerField('MY_AUTHOR_ID'))
                ->configurePrimary(true),

            // Определение ссылки на таблицу AuthorTable
            (new Reference('MY_AUTHOR', AuthorTable::class,
                Join::on('this.MY_AUTHOR_ID', 'ref.ID')))
                ->configureJoinType('inner'),
        ];
    }
}
```

Как и в случае с `Reference` и `OneToMany`, здесь можно переопределить тип джойна с помощью метода `configureJoinType`. По умолчанию используется тип LEFT.

```php
(new ManyToMany('AUTHORS', AuthorTable::class))
    ->configureTableName('b_book_author') // Указание имени таблицы-связки
    ->configureJoinType('inner') // Указание типа соединения INNER JOIN
```

#### 4\. Как работать с данными

Работа с данными аналогична отношениям 1:N.

Добавление связи:

-  `addToBooks` -- добавляет книгу в коллекцию книг автора,

-  `save` -- сохраняет изменения в базе данных.

```php
$author = \Bitrix\Main\Test\Typography\AuthorTable::getByPrimary(17)
    ->fetchObject(); // Получаем объект автора с ID 17

$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject(); // Получаем объект книги с ID 1

$author->addToBooks($book); // Добавляем книгу к автору
$author->save(); // Сохраняем изменения
```

Выборка данных:

-  `'select' => ['*', 'AUTHORS']` -- выбирает все поля книги и связанных авторов,

-  `getAuthors()` -- возвращает коллекцию авторов.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(2, [
    'select' => ['*', 'AUTHORS'] // Выбираем все поля книги и связанных авторов
])->fetchObject();

foreach ($book->getAuthors() as $author) {
    echo $author->getLastName(); // Выводим фамилию каждого автора
}
// Цикл выведет "Last name 17" и "Last name 18"
```

#### 5\. Связь между объектами сущностей

Связь со стороны авторов:

```php
$author = \Bitrix\Main\Test\Typography\AuthorTable::getByPrimary(17)
    ->fetchObject(); // Получаем объект автора с ID 17

$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject(); // Получаем объект книги с ID 1

$author->addToBooks($book); // Добавляем книгу к автору
$author->save(); // Сохраняем изменения
```

Связь со стороны книг:

```php
$author = \Bitrix\Main\Test\Typography\AuthorTable::getByPrimary(17)
    ->fetchObject(); // Получаем объект автора с ID 17

$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject(); // Получаем объект книги с ID 1

$book->addToAuthors($author); // Добавляем автора к книге
$book->save(); // Сохраняем изменения
```

### Пример отношений со вспомогательными данными

Когда есть дополнительные данные, отношение следует описывать отдельной сущностью. Например, кроме первичных ключей исходных сущностей `STORE_ID` и `BOOK_ID` есть еще количество книг `QUANTITY`.

#### 1\. Промежуточная таблица

В промежуточной таблице используются параметры:

-  `STORE_ID` и `BOOK_ID` -- первичные ключи из таблиц `StoreTable` и `BookTable`,

-  `QUANTITY` -- дополнительное поле для хранения количества книг.

```php
namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Data\DataManager; 
use Bitrix\Main\ORM\Fields\IntegerField; 
use Bitrix\Main\ORM\Fields\Relations\Reference; // Импорт класса Reference для создания ссылок на другие таблицы
use Bitrix\Main\ORM\Query\Join; // Импорт класса Join для определения условий соединения

// Класс StoreBookTable наследует DataManager для работы с данными
class StoreBookTable extends DataManager 
{
    // Метод для получения имени таблицы
    public static function getTableName()
    {
        return 'b_store_book'; // Имя таблицы, которая хранит данные о книгах в магазинах
    }

    // Метод для определения карты полей таблицы
    public static function getMap()
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

            // Определение поля QUANTITY для хранения количества Книг
            (new IntegerField('QUANTITY'))
                ->configureDefaultValue(0) // Установка значения по умолчанию
        ];
    }
}
```

Использование `ManyToMany` ограничено, потому что это поле не предоставляет доступ к вспомогательным данным, таким как `QUANTITY`. С помощью `removeFrom*()` можно удалить связь, а с помощью `addTo*()` -- добавить связь со значением `QUANTITY` только по умолчанию, без возможности обновить его.

#### 2\. Как работать со вспомогательными данными

Для работы с вспомогательными данными используйте отдельную сущность-посредник.

```php
// Объект книги
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
	->fetchObject();
// Объект магазина
$store = \Bitrix\Main\Test\Typography\StoreTable::getByPrimary(34)
	->fetchObject();
// Новый объект связи книги с магазином
$item = \Bitrix\Main\Test\Typography\StoreBookTable::createObject()
	->setBook($book)
	->setStore($store)
	->setQuantity(5);
// Сохранение
$item->save();
```

Обновить количество книг:

```php
// Объект существующей связи
$item = \Bitrix\Main\Test\Typography\StoreBookTable::getByPrimary([
	'STORE_ID' => 33, 'BOOK_ID' => 2
])->fetchObject();
// Обновление количества
$item->setQuantity(12);
// Сохранение
$item->save();
```

Удалить связи:

```php
// Объект существующей связи
$item = \Bitrix\Main\Test\Typography\StoreBookTable::getByPrimary([
	'STORE_ID' => 33, 'BOOK_ID' => 2
])->fetchObject();
// Удаление
$item->delete();
```

Для массивов используйте стандартные подходы по работе с данными:

```php
// Добавление записи
\Bitrix\Main\Test\Typography\StoreBookTable::add([
	'STORE_ID' => 34, 'BOOK_ID' => 1, 'QUANTITY' => 5
]);
// Обновление записи
\Bitrix\Main\Test\Typography\StoreBookTable::update(
	['STORE_ID' => 34, 'BOOK_ID' => 1],
	['QUANTITY' => 12]
);
// Удаление записи
\Bitrix\Main\Test\Typography\StoreBookTable::delete(
	['STORE_ID' => 34, 'BOOK_ID' => 1]
);
```

В случае со вспомогательными данными используйте вместо поля `ManyToMany` тип `OneToMany`:

```php
//Файл bitrix/modules/main/lib/test/typography/booktable.php
namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Fields\Relations\OneToMany; // Импорт класса OneToMany для создания связи «один ко многим»

// Класс BookTable наследует DataManager для работы с данными
class BookTable extends \Bitrix\Main\ORM\Data\DataManager 
{
    public static function getMap() // Метод определяет карту полей таблицы
    {
        return [
            // Здесь могут быть другие поля и связи, определенные для таблицы книг

            // Определение связи «один ко многим» с таблицей StoreBookTable
            (new OneToMany('STORE_ITEMS', StoreBookTable::class, 'BOOK'))
            // 'STORE_ITEMS' — имя связи, используемое для доступа к связанным записям
            // StoreBookTable::class — класс таблицы, с которой устанавливается связь
            // 'BOOK' — поле в StoreBookTable, используемое для связи с таблицей книг
        ];
    }
}
```

```php
//Файл bitrix/modules/main/lib/test/typography/storetable.php
namespace Bitrix\Main\Test\Typography; 

use Bitrix\Main\ORM\Fields\Relations\OneToMany; // Импорт класса OneToMany для создания связи «один ко многим»

// Класс StoreTable наследует DataManager для работы с данными
class StoreTable extends \Bitrix\Main\ORM\Data\DataManager 
{
    public static function getMap() // Метод определяет карты полей таблицы
    {
        return [
            // Здесь могут быть другие поля и связи, определенные для таблицы магазинов

            // Определение связи «один ко многим» с таблицей StoreBookTable
            (new OneToMany('BOOK_ITEMS', StoreBookTable::class, 'STORE'))
            // 'BOOK_ITEMS' — имя связи, используемое для доступа к связанным записям
            // StoreBookTable::class — класс таблицы, с которой устанавливается связь
            // 'STORE' — поле в StoreBookTable, используемое для связи с таблицей магазинов
        ];
    }
}
```

Выборка будет аналогична отношениям 1:N, но на этот раз будут возвращаться объекты отношения `StoreBook`, а не сущности-партнера.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1, [
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
