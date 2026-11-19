---
title: Объекты
description: 'Объекты. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

В Bitrix Framework класс объекта описывает работу с данными таблицы, а его экземпляр представляет одну запись или новую запись до сохранения. Методы объекта читают и меняют значения полей, сохраняют и удаляют запись, управляют связями с другими сущностями.

Примеры статьи используют сущности модуля `somepartner.mybookscatalog` — их описание смотрите в статье [Концепция ORM](./orm-concepts.md#book-model). Перед обращением к классам подключите модуль вызовом `Loader::includeModule('somepartner.mybookscatalog')` — подробнее в разделе [Подключить модуль сущности](./orm-concepts.md#include-module).

{% note info "" %}

Примеры с выборкой и изменением предполагают, что в таблицах модуля уже есть книги с ID 1 и 2, авторы с ID 17 и 18 и издательство с ID 253. Показанный вывод соответствует этим условным данным.

{% endnote %}

Чтобы использовать объекты, сначала опишите сущность. Метод `fetchObject` возвращает запись из базы данных в виде объекта, метод `fetch` — в виде массива. Метод `fetchCollection` возвращает несколько записей в виде коллекции объектов — о ней читайте в статье [Коллекции](./collections.md).

**Пример.** Код получает книгу с ID 1 в виде объекта.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
```

Переменная `$book` содержит объект сущности `Book`. Метод `$book->getTitle()` возвращает название книги, метод `$book->setTitle('New Title')` меняет его.

## Класс объекта

У каждой сущности есть свой класс объектов. ORM создает его автоматически, и он наследует класс `Bitrix\Main\ORM\Objectify\EntityObject`.

Для сущности `Book` ORM создает класс `EO_Book` в пространстве имен класса `BookTable`. Вместо суффикса `Table` имя класса получает префикс `EO_` — сокращение от `EntityObject`. Префикс отличает системный класс от существующих классов с тем же именем.

### Как создать свой класс

Чтобы задать собственное имя класса объекта или добавить в него методы, создайте свой класс и подключите его к классу сущности.

1. Создайте класс, который наследует `EO_Book`.

   ```php
   // Файл /local/modules/somepartner.mybookscatalog/lib/book.php
   namespace SomePartner\MyBooksCatalog;

   class Book extends EO_Book
   {
       // Здесь можно добавить свои методы и функционал
   }
   ```

2. Верните имя своего класса из метода `getObjectClass` класса `BookTable`.

   ```php
   // Файл /local/modules/somepartner.mybookscatalog/lib/booktable.php
   namespace SomePartner\MyBooksCatalog;

   use Bitrix\Main\ORM\Data\DataManager;

   class BookTable extends DataManager
   {
       public static function getObjectClass()
       {
           return Book::class;
       }
       // ...
   }
   ```

Метод `getObjectClass` задает класс, объектами которого ORM представляет записи таблицы. После этого метод `fetchObject` возвращает объекты класса `SomePartner\MyBooksCatalog\Book`.

### Что учесть в своем классе

-  Обращайтесь к классу объекта по имени своего класса или через методы `BookTable::getObjectClass()`, `BookTable::createObject()` и `BookTable::wakeUpObject()`. Не используйте стандартное имя в конструкциях `instanceof EO_Book`, `new EO_Book` и `EO_Book::class`.

-  Добавляйте свои методы и переопределяйте методы базового класса. Не объявляйте свойства `primary`, `entity`, `state` и `dataClass` — базовый класс обрабатывает эти имена как виртуальные свойства только для чтения.

## Именованные методы

Большинство методов для работы с полями именованные. У каждого поля есть собственные методы, например `getTitle`, `setTitle` и `remindActualTitle` для поля `TITLE`.

**Пример.** Код вызывает именованные методы поля `TITLE`.

```php
$book->getTitle();
$book->setTitle($value);
$book->remindActualTitle();
$book->resetTitle();
// и так далее
```

### Особенности именованных методов

Именованные методы дают два эффекта:

-  переопределение — в своем классе объекта можно переопределить метод отдельного поля, например `getTitle`,

-  автодополнение — IDE подсказывает имена методов, если для сущностей сгенерированы аннотации. Как их создать, читайте в статье [Аннотации классов](./annotations.md).

### Универсальные методы

Универсальные методы `get`, `set`, `remindActual`, `reset` и другие принимают имя поля первым аргументом. Имя поля можно передать из переменной, поэтому один код работает с разными полями.

**Пример.** Код вызывает универсальные методы для поля, имя которого хранится в переменной.

```php
$fieldName = 'TITLE';
$book->get($fieldName);
$book->set($fieldName, $value);
$book->remindActual($fieldName);
$book->reset($fieldName);
// и так далее
```

Если в своем классе объекта переопределен именованный метод, универсальный метод вызывает переопределенный.

**Пример.** Класс `Book` переопределяет метод `getTitle`, и вызов `get('TITLE')` возвращает то же значение.

```php
namespace SomePartner\MyBooksCatalog;

class Book extends EO_Book
{
    public function getTitle()
    {
        return 'custom title';
    }
}

$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;

echo $book->getTitle(); // 'custom title'
echo $book->get('TITLE'); // 'custom title'
```

Метод `fill` — исключение. Он не вызывает переопределенные именованные методы.

## Приведение типов

Объект приводит значения к типу поля. Числовое поле возвращает число, строковое — строку.

**Пример.** Код получает значения полей `ID` и `TITLE` и выводит их типы.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
var_dump($book->getId()); // int 1
var_dump($book->getTitle()); // string 'Title 1' (length=7)
```

Поле `BooleanField` в объекте принимает и возвращает `true` или `false`. Если в базе данных значения хранятся как `N` и `Y`, ORM преобразует их. Пару значений задает метод `configureValues()` — короткий синоним `configureStorageValues()`.

**Пример.** Поле `IS_ARCHIVED` хранит в базе данных `N` и `Y`, а объект возвращает и принимает boolean.

```php
// (new BooleanField('IS_ARCHIVED'))
//     ->configureValues('N', 'Y'),

$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
var_dump($book->getIsArchived()); // boolean true

// При установке значений также ожидается boolean
$book->setIsArchived(false);
```

## Как прочитать данные объекта

Методы чтения возвращают текущее и актуальное значение поля и набор значений объекта. Свойство `primary` возвращает первичный ключ.

### get

Метод `get` возвращает значение поля. Если значение не загружено, например поле не указано в `select`, метод возвращает `null`.

**Пример.** Код получает название книги.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
$title = $book->getTitle();
```

### require

Метод `require` возвращает значение поля. Если оно не было загружено из базы данных и не устанавливалось в объекте, метод выбрасывает исключение `Bitrix\Main\SystemException`. Если поле содержит `null`, метод возвращает `null`.

**Пример.** Поле `TITLE` загружено, поэтому `requireTitle()` возвращает то же значение, что `getTitle()`.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
$title = $book->requireTitle();
```

**Пример.** Поле `TITLE` не указано в `select` и не установлено в объекте, поэтому `requireTitle()` выбрасывает исключение.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1, ['select' => ['ID', 'PUBLISHER_ID', 'ISBN']])
    ->fetchObject()
;
$title = $book->requireTitle();
// SystemException: "TITLE value is required for further operations"
```

### remindActual

Метод `remindActual` возвращает актуальное значение поля — загруженное из базы данных или записанное при сохранении, — даже если в объекте уже установлено новое значение.

**Пример.** Код меняет название книги и получает исходное название.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
echo $book->getTitle(); // "Title 1"
$book->setTitle("New title");
echo $book->getTitle(); // "New title"
echo $book->remindActualTitle(); // "Title 1"
```

**Пример.** Универсальные методы получают значения поля, имя которого хранится в переменной.

```php
$fieldName = 'TITLE';
$title = $book->get($fieldName);
$title = $book->require($fieldName);
$title = $book->remindActual($fieldName);
```

### primary

Свойство `primary` доступно только для чтения и возвращает массив значений первичного ключа.

**Пример.** Код получает первичный ключ книги массивом и значение поля `ID`.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
$primary = $book->primary; // ['ID' => 1]
$id = $book->getId(); // 1
```

### collectValues

Метод `collectValues` возвращает значения объекта в виде массива. Все аргументы метода необязательные.

| Параметр | Тип | Описание |
|---|---|---|
| `$valuesType` | `int` | Какие значения вернуть, константа класса `Bitrix\Main\ORM\Objectify\Values`. По умолчанию `Values::ALL` |
| `$fieldsMask` | `int` | Типы полей, маска из констант класса `Bitrix\Main\ORM\Fields\FieldTypeMask`. По умолчанию `FieldTypeMask::ALL`. Значения маски описаны в разделе [Заполнить объект](#fill) |
| `$recursive` | `bool` | Если `true`, метод преобразует в массивы и связанные объекты и коллекции. По умолчанию `false` |

Константы класса `Values`:

-  `ACTUAL` — значения, загруженные из базы данных или записанные при сохранении,

-  `CURRENT` — текущие значения, установленные в объекте и еще не сохраненные,

-  `ALL` — актуальные и текущие значения вместе. Если у поля есть оба значения, метод возвращает текущее.

**Пример.** Код получает все значения книги.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
$values = $book->collectValues();
```

**Пример.** Код получает актуальные, текущие и все значения книги.

```php
$values = $book->collectValues(\Bitrix\Main\ORM\Objectify\Values::ACTUAL);
$values = $book->collectValues(\Bitrix\Main\ORM\Objectify\Values::CURRENT);
$values = $book->collectValues(\Bitrix\Main\ORM\Objectify\Values::ALL);
```

**Пример.** Код получает текущие значения скалярных полей и все значения, кроме пользовательских полей.

```php
$values = $book->collectValues(
    \Bitrix\Main\ORM\Objectify\Values::CURRENT,
    \Bitrix\Main\ORM\Fields\FieldTypeMask::SCALAR
);
$values = $book->collectValues(
    \Bitrix\Main\ORM\Objectify\Values::ALL,
    \Bitrix\Main\ORM\Fields\FieldTypeMask::ALL & ~\Bitrix\Main\ORM\Fields\FieldTypeMask::USERTYPE
);
```

### runtime

Универсальный метод `get` возвращает значение `runtime`-поля, добавленного в запрос. Как добавить такое поле, читайте в разделе [Runtime-поля](./query-builder.md#runtime-fields).

**Пример.** Запрос добавляет поле `FULL_NAME` из имени и фамилии автора, метод `get` возвращает его значение.

```php
$author = \SomePartner\MyBooksCatalog\AuthorTable::query()
    ->registerRuntimeField(
        new \Bitrix\Main\ORM\Fields\ExpressionField(
            'FULL_NAME', "CONCAT(%s, ' ', %s)", ['NAME', 'LAST_NAME']
        )
    )
    ->addSelect('ID')
    ->addSelect('FULL_NAME')
    ->where('ID', 17)
    ->fetchObject()
;
echo $author->get('FULL_NAME'); // 'Name 17 Last name 17'
```

Метод `has` проверяет, есть ли в объекте значение `runtime`-поля. Метод `set` для `runtime`-поля выбрасывает исключение `Bitrix\Main\SystemException`, потому что поле доступно только для чтения.

## Записать данные объекта

Методы записи устанавливают новое значение поля, отменяют его и удаляют значение из объекта. Изменения хранятся в объекте, пока не вызван метод `save` — подробнее в разделе [Сохранить объект](#save).

### set

Метод `set` устанавливает новое значение поля.

**Пример.** Код устанавливает новое название книги.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
$book->setTitle("New title");
```

Объект хранит новое значение как текущее, а исходное остается актуальным.

**Пример.** Код получает текущее и актуальное название книги.

```php
$book->getTitle(); // текущее значение
$book->remindActualTitle(); // актуальное значение
```

Первичный ключ можно установить только в новом объекте. Чтобы сменить первичный ключ существующей записи, создайте новый объект и удалите старый.

Значение поля [`Bitrix\Main\ORM\Fields\ExpressionField`](../api-reference/main/orm/fields/expression-field/index.md) вычисляет SQL-выражение, поэтому установить его через `set` нельзя.

Если новое значение совпадает с актуальным, объект не меняет поле, и метод `save` не включает его в SQL-запрос.

### reset

Метод `reset` отменяет новое значение поля, и поле снова возвращает актуальное значение.

**Пример.** Код меняет название книги и отменяет изменение.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
echo $book->getTitle(); // "Title 1"
$book->setTitle("New title");
echo $book->getTitle(); // "New title"
$book->resetTitle();
echo $book->getTitle(); // "Title 1"
```

### unset

Метод `unset` удаляет значение поля из объекта, как если бы поле не выбиралось из базы данных и не устанавливалось.

**Пример.** Код удаляет название из объекта книги, после чего `getTitle()` возвращает `null`.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
echo $book->getTitle(); // "Title 1"
$book->unsetTitle();
echo $book->getTitle(); // null
```

**Пример.** Универсальные методы устанавливают, отменяют и удаляют значение поля по его имени.

```php
$fieldName = 'TITLE';
$book->set($fieldName, "New title");
$book->reset($fieldName);
$book->unset($fieldName);
```

## Проверить значения полей

Методы проверки возвращают `true` или `false`. Они показывают, есть ли у поля актуальное значение, текущее значение или любое из них.

### isFilled

Метод `isFilled` проверяет, содержит ли объект актуальное значение поля.

**Пример.** Объект восстановлен только по первичному ключу, поэтому поле `TITLE` заполнено только после вызова `fillTitle()`.

```php
use SomePartner\MyBooksCatalog\Book;
// актуальными считаются значения из методов fetch* и wakeUp
// в примере при инициализации объекта передается только первичный ключ
$book = Book::wakeUp(1);
var_dump($book->isTitleFilled()); // false
$book->fillTitle();
var_dump($book->isTitleFilled()); // true
```

### isChanged

Метод `isChanged` проверяет, установлено ли в поле текущее значение, которое еще не сохранено.

**Пример.** Код проверяет поле `TITLE` до и после установки нового названия.

```php
use SomePartner\MyBooksCatalog\Book;
// объект может иметь исходное значение, а может и не иметь
// это не повлияет на дальнейшее поведение
$book = Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);
var_dump($book->isTitleChanged()); // false
$book->setTitle('New title 1');
var_dump($book->isTitleChanged()); // true
```

Метод `isChanged` работает и для новых объектов, пока их значения не сохранены в базе данных.

### has

Метод `has` проверяет, есть ли у поля актуальное или текущее значение. Результат совпадает с `isFilled() || isChanged()`.

**Пример.** Название пришло в `wakeUp`, признак архива установлен через `set`, а ISBN в объекте нет.

```php
use SomePartner\MyBooksCatalog\Book;

$book = Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);
$book->setIsArchived(true);
var_dump($book->hasTitle()); // true
var_dump($book->hasIsArchived()); // true
var_dump($book->hasIsbn()); // false
```

## Проверить состояние объекта

Объект может находиться в одном из четырех состояний:

-  `RAW` — новый. Объект создан и еще не сохранен в базе данных.

-  `ACTUAL` — актуальный. Значения объекта совпадают с данными в базе данных.

-  `CHANGED` — измененный. В объекте есть текущие значения, которые еще не сохранены.

-  `DELETED` — удаленный. Для объекта вызван метод `delete()`.

Методы `set`, `save` и `delete` переводят объект из одного состояния в другое. Свойство `state` доступно только для чтения и возвращает состояние объекта. Сравнивайте его с константами класса `\Bitrix\Main\ORM\Objectify\State`.

**Пример.** Код проводит новую книгу через все четыре состояния.

```php
use SomePartner\MyBooksCatalog\Book;
use Bitrix\Main\ORM\Objectify\State;

$book = new Book();
$book->setTitle('New title');
$book->setIsbn('9780321127426');
var_dump($book->state === State::RAW); // true

$book->save();
var_dump($book->state === State::ACTUAL); // true

$book->setTitle('Another one title');
var_dump($book->state === State::CHANGED); // true

$book->delete();
var_dump($book->state === State::DELETED); // true
```

## Сохранить объект {#save}

Метод `save` записывает в базу данных измененные поля и измененные связи объекта. Для записи метод вызывает методы класса сущности и возвращает объект результата. Класс результата зависит от состояния объекта.

| Состояние объекта | Что делает `save` | Класс результата |
|---|---|---|
| `RAW` | Вызывает `BookTable::add()` | `Bitrix\Main\ORM\Data\AddResult` |
| `CHANGED` | Вызывает `BookTable::update()` с измененными полями | `Bitrix\Main\ORM\Data\UpdateResult` |
| `ACTUAL` | Не обращается к таблице сущности, сохраняет только измененные связи | `Bitrix\Main\ORM\Data\UpdateResult` |

Проверяйте результат через `isSuccess()`, а тексты ошибок получайте через `getErrorMessages()`. Если `add` или `update` вернули ошибку, `save` сразу возвращает этот результат. Объект сохраняет прежнее состояние `RAW` или `CHANGED`, и текущие значения не становятся актуальными.

**Пример.** Код меняет название книги и проверяет результат сохранения.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
$book->setTitle("New title");

$result = $book->save();

if (!$result->isSuccess())
{
    var_dump($result->getErrorMessages());
}
```

Подробнее о классах результата и их методах читайте в статье [Операции с сущностями](./entity-operations.md#basic-operations).

После успешного сохранения все текущие значения объекта становятся актуальными.

**Пример.** Актуальное название книги меняется только после вызова `save`.

```php
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
echo $book->remindActualTitle(); // "Title 1"
$book->setTitle("New title");
echo $book->remindActualTitle(); // "Title 1"
$book->save();
echo $book->remindActualTitle(); // "New title"
```

### Как создать новый объект

Новый объект создают одним из двух способов.

-  Конструктор класса объекта.

   ```php
   $newBook = new \SomePartner\MyBooksCatalog\Book();
   $newBook->setTitle('New title');
   $newBook->setIsbn('9780321127426'); // ISBN — обязательное поле
   $newBook->save();

   $newAuthor = new \SomePartner\MyBooksCatalog\EO_Author();
   $newAuthor->setName('Some name');
   $newAuthor->save();
   ```

   Конструктор работает и для системного класса с префиксом `EO_`, и для своего класса. Если код создает объекты системного класса, а потом в модуле появляется свой класс, код переписывать не нужно — системный класс `EO_` становится алиасом своего класса.

-  Метод `createObject` класса сущности.

   ```php
   $newBook = \SomePartner\MyBooksCatalog\BookTable::createObject();
   $newBook->setTitle('New title');
   $newBook->setIsbn('9780321127426');
   $newBook->save();
   ```

Новый объект получает значения по умолчанию из описания полей в `getMap`. Чтобы создать объект без них, передайте `false` в конструктор или в метод `createObject`.

**Пример.** Код создает объекты книги без значений по умолчанию.

```php
$newBook = new \SomePartner\MyBooksCatalog\Book(false);
$newBook = \SomePartner\MyBooksCatalog\BookTable::createObject(false);
```

Значения нового объекта до сохранения считаются текущими, после сохранения становятся актуальными.

После успешного сохранения нового объекта ORM записывает в него первичный ключ из результата `add`. Значение доступно и в объекте, и в результате.

**Пример.** Код создает книгу и получает ее идентификатор.

```php
$newBook = \SomePartner\MyBooksCatalog\BookTable::createObject();
$newBook->setTitle('New title');
$newBook->setIsbn('9780321127426');

$result = $newBook->save();

if ($result->isSuccess())
{
    $id = $newBook->getId(); // совпадает с $result->getId()
}
```

## Удалить объект

Метод `delete()` удаляет объект из базы данных. Сначала метод обрабатывает связи объекта, затем вызывает `BookTable::delete()` по первичному ключу объекта.

Метод возвращает объект `Bitrix\Main\ORM\Data\Result`. Если удаление записи или связей завершилось ошибкой, ошибки попадают в этот результат. Проверяйте его через `isSuccess()`.

**Пример.** Код удаляет книгу, полученную из базы данных, и книгу, восстановленную по первичному ключу.

```php
// Удаление записи
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(1)
    ->fetchObject()
;
$result = $book->delete();

if (!$result->isSuccess())
{
    var_dump($result->getErrorMessages());
}

// Удаление по первичному ключу
$book = \SomePartner\MyBooksCatalog\Book::wakeUp(2);
$result = $book->delete();
```

{% note warning "" %}

После вызова `delete()` объект переходит в состояние `DELETED`, даже если результат содержит ошибки. Состояние объекта не подтверждает удаление записи — проверяйте `isSuccess()`.

{% endnote %}

При удалении объекта через метод `delete()` срабатывают события удаления сущности. Дополнительные действия можно описать в обработчике события `onDelete`. Подробнее — в разделе [События](./entity-operations.md#events).

### Каскадное удаление связей

Политика каскадного удаления поля отношения задает, что метод `delete()` делает со связанными объектами. Политику настраивают в `getMap` методом `configureCascadeDeletePolicy()`. Значения — константы класса `Bitrix\Main\ORM\Fields\Relations\CascadePolicy`.

| Тип поля | Политика по умолчанию | Политика | Что делает `delete()` |
|---|---|---|---|
| `Reference`, связь N:1 и 1:1 | `NO_ACTION` | `NO_ACTION` | Не меняет связанный объект |
| `Reference`, связь N:1 и 1:1 | `NO_ACTION` | `FOLLOW` | Вызывает `delete()` у связанного объекта |
| `OneToMany`, связь 1:N | `SET_NULL` | `SET_NULL` | Отвязывает связанные объекты, как `removeAll`: в их поле ссылки записывается `null` |
| `OneToMany`, связь 1:N | `SET_NULL` | `FOLLOW` | Загружает коллекцию связанных объектов и вызывает `delete()` у каждого |
| `OneToMany`, связь 1:N | `SET_NULL` | `NO_ACTION` | Не меняет связанные объекты |
| `ManyToMany`, связь N:M | `NO_ACTION` | Любая | Удаляет записи связующей таблицы. Связанные объекты остаются в базе данных |

Для `Reference` с политикой `FOLLOW` метод берет связанный объект из значения поля и не загружает его из базы данных. Если значение поля не загружено или равно `null`, вызов `delete()` у пустого значения завершится ошибкой PHP. Перед удалением заполните поле, например методом `fill`.

**Пример.** Поле `BOOKS` издательства удаляет книги вместе с издательством.

```php
use Bitrix\Main\ORM\Fields\Relations\CascadePolicy;
use Bitrix\Main\ORM\Fields\Relations\OneToMany;

// В методе getMap класса PublisherTable
(new OneToMany('BOOKS', BookTable::class, 'PUBLISHER'))
    ->configureCascadeDeletePolicy(CascadePolicy::FOLLOW),
```

Как описать поля отношений, читайте в статье [Отношения между сущностями](./entity-relations.md).

## Восстановить объект

Метод `wakeUp` создает объект из уже имеющихся данных записи и не обращается к базе данных. Переданные значения объект считает актуальными.

**Пример.** Код восстанавливает книгу по первичному ключу.

```php
$book = \SomePartner\MyBooksCatalog\Book::wakeUp(1);
```

Метод `wakeUp` принимает скалярное значение, только если первичный ключ состоит из одного поля. Для составного первичного ключа передайте массив со всеми полями ключа. Если передан скаляр или в массиве не хватает поля ключа, метод выбрасывает исключение `Bitrix\Main\ArgumentException`.

Кроме первичного ключа, в `wakeUp` можно передать часть значений полей или все значения.

**Пример.** Код восстанавливает книгу с названием и идентификатором издательства.

```php
$book = \SomePartner\MyBooksCatalog\Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1', 'PUBLISHER_ID' => 253]);
```

Метод `wakeUp` вызывают у своего класса объекта или у системного класса с префиксом `EO_`. У класса сущности ту же задачу выполняет метод `wakeUpObject`.

**Пример.** Код восстанавливает книгу тремя способами.

```php
// Свой класс
$book = \SomePartner\MyBooksCatalog\Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);

// Системный класс
$book = \SomePartner\MyBooksCatalog\EO_Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);

// Через фабрику сущности
$book = \SomePartner\MyBooksCatalog\BookTable::wakeUpObject(['ID' => 1, 'TITLE' => 'Title 1']);
```

В `wakeUp` можно передать и значения отношений. Из них метод восстанавливает связанные объекты, например издательство книги и ее авторов.

**Пример.** Код восстанавливает книгу вместе с издательством и двумя авторами.

```php
$book = \SomePartner\MyBooksCatalog\Book::wakeUp([
    'ID' => 2,
    'TITLE' => 'Title 2',
    'PUBLISHER' => ['ID' => 253, 'TITLE' => 'Publisher Title 253'],
    'AUTHORS' => [
        ['ID' => 17, 'NAME' => 'Name 17'],
        ['ID' => 18, 'NAME' => 'Name 18']
    ]
]);
```

## Заполнить объект {#fill}

Чтобы загрузить из базы данных недостающие значения полей, используйте именованный метод `fill`.

**Пример.** Объект автора содержит только `ID` и `NAME`, метод `fillLastName()` загружает фамилию.

```php
// Изначально у нас есть только ID и NAME
$author = \SomePartner\MyBooksCatalog\EO_Author::wakeUp(
    ['ID' => 17, 'NAME' => 'Name 17']
);
// Добавляем LAST_NAME из базы данных
$author->fillLastName();
```

Метод `fill` записывает загруженные значения в объект как актуальные.

Универсальный метод `fill` принимает имя поля, массив имен или маску типов полей. Метод загружает только незаполненные поля. Без аргумента метод загружает все незаполненные поля.

**Пример.** Код загружает поля автора по списку имен, все незаполненные поля и поля по маске.

```php
$author = \SomePartner\MyBooksCatalog\EO_Author::wakeUp(17);

// Заполнение нескольких полей
$author->fill(['NAME', 'LAST_NAME']);

// Заполнение всех незаполненных полей
$author->fill();

// Заполнение полей по маске, например, все незаполненные скалярные поля
$author->fill(\Bitrix\Main\ORM\Fields\FieldTypeMask::SCALAR);

// Незаполненные скалярные и пользовательские поля
$author->fill(
    \Bitrix\Main\ORM\Fields\FieldTypeMask::SCALAR
    | \Bitrix\Main\ORM\Fields\FieldTypeMask::USERTYPE
);
```

Маски — константы класса `Bitrix\Main\ORM\Fields\FieldTypeMask`:

-  `SCALAR` — скалярные поля `Bitrix\Main\ORM\Fields\ScalarField`,

-  `EXPRESSION` — выражения [`Bitrix\Main\ORM\Fields\ExpressionField`](../api-reference/main/orm/fields/expression-field/index.md),

-  `USERTYPE` — пользовательские поля,

-  `REFERENCE` — отношения 1:1 и N:1 `Bitrix\Main\ORM\Fields\Relations\Reference`,

-  `ONE_TO_MANY` — отношения 1:N `Bitrix\Main\ORM\Fields\Relations\OneToMany`,

-  `MANY_TO_MANY` — отношения N:M `Bitrix\Main\ORM\Fields\Relations\ManyToMany`,

-  `FLAT` — скалярные поля и выражения,

-  `RELATION` — все отношения,

-  `ALL` — все доступные поля.

Если нужно дозаполнить несколько объектов, используйте метод `fill` коллекции объектов вместо вызова в цикле. Коллекция загружает значения для всех объектов одним запросом. Подробнее — в разделе [Заполнить недостающие данные](./collections.md#fill) статьи «Коллекции».

## Как управлять отношениями

Методы `addTo`, `removeFrom` и `removeAll` добавляют и удаляют связи в полях `OneToMany` и `ManyToMany`, например в поле `BOOKS` издательства. Меняйте связи через `addTo`, `removeFrom` и `removeAll`, а не через объект коллекции напрямую, чтобы объект зафиксировал изменения. Связь в поле `Reference` задают методом `set`, например `$book->setPublisher($publisher)`.

Методы меняют связи только в объекте. Чтобы записать изменения в базу данных, вызовите метод `save` объекта.

Поля отношений описывают в `getMap` сущности — как это сделать, читайте в статье [Отношения между сущностями](./entity-relations.md). Значение поля `OneToMany` и `ManyToMany` — коллекция объектов. Ее методы описаны в статье [Коллекции](./collections.md).

### addTo

Метод `addTo` добавляет объект в коллекцию поля отношения. Объект должен принадлежать классу объектов связанной сущности, иначе метод выбрасывает исключение `Bitrix\Main\ArgumentException`.

**Пример.** Код добавляет книгу с ID 2 к издательству с ID 253 и сохраняет издательство.

```php
// Инициализация издательства
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::getByPrimary(253)
    ->fetchObject()
;
// Инициализация книги
$book = \SomePartner\MyBooksCatalog\BookTable::getByPrimary(2)
    ->fetchObject()
;
// Добавление книги в коллекцию отношения
$publisher->addToBooks($book);
// Сохранение
$publisher->save();
```

### removeFrom

Метод `removeFrom` удаляет один объект из коллекции поля отношения.

Перед вызовом загрузите поле отношения и передайте в метод объект из коллекции. При сохранении ORM сохраняет объект с тем же первичным ключом из коллекции. Если коллекция не загружена, ORM сохраняет вместо переданного объекта новый объект без изменений, и связь в базе данных не меняется. Метод `save()` при этом возвращает успешный результат.

**Пример.** Код удаляет книгу с ID 2 из книг издательства и сохраняет издательство.

```php
// Инициализация издательства вместе с книгами
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::getByPrimary(253, [
    'select' => ['*', 'BOOKS'],
])->fetchObject();

// Книга из загруженной коллекции
$book = $publisher->getBooks()->getByPrimary(2);

if ($book)
{
    // Удаление одной конкретной книги издательства
    $publisher->removeFromBooks($book);
    // Сохранение
    $publisher->save();
}
```

### removeAll

Метод `removeAll` удаляет все связи в поле отношения.

**Пример.** Код удаляет все книги издательства из поля `BOOKS` и сохраняет издательство.

```php
// Инициализация издательства
$publisher = \SomePartner\MyBooksCatalog\PublisherTable::getByPrimary(253)
    ->fetchObject()
;

// Удаление всех книг издательства
$publisher->removeAllBooks();
// Сохранение
$publisher->save();
```

Чтобы удалить связи, методу `removeAll` нужен текущий состав коллекции. Если поле `BOOKS` не выбрано из базы данных, метод загружает его перед удалением.

### Универсальные методы

Универсальные методы `addTo`, `removeFrom` и `removeAll` принимают имя поля отношения первым аргументом.

Для `removeFrom` действует то же условие, что и для `removeFromBooks`: поле должно быть загружено, а объект взят из коллекции.

**Пример.** Код меняет связи в поле `BOOKS`, имя которого хранится в переменной.

```php
$fieldName = 'BOOKS';
$publisher->addTo($fieldName, $book);
$publisher->removeFrom($fieldName, $book);
$publisher->removeAll($fieldName);
```

## Интерфейс ArrayAccess

Объект реализует интерфейс `ArrayAccess`, поэтому к полям объекта можно обращаться как к элементам массива. Чтение элемента вызывает метод `get`, запись — метод `set`. Код, написанный для массивов из `fetch`, можно перевести на объекты без смены синтаксиса обращения к полям.

**Пример.** Код читает и меняет имя автора через синтаксис массива.

```php
$author = \SomePartner\MyBooksCatalog\AuthorTable::getByPrimary(17)->fetchObject();

echo $author['NAME'];
// Аналогично вызову метода $author->getName()

$author['NAME'] = 'New name';
// Аналогично вызову метода $author->setName('New name')
```

{% note warning "" %}

Интерфейс `ArrayAccess` не работает с `runtime`-полями. Чтение `$author['FULL_NAME']` выбрасывает исключение `Bitrix\Main\ArgumentException`, потому что поля нет в карте сущности. Присваивание `$author['FULL_NAME'] = ...` выбрасывает `Bitrix\Main\SystemException`, потому что `runtime`-поле доступно только для чтения. Значение `runtime`-поля получайте методом `get()`.

{% endnote %}

**Пример.** Код получает значение `runtime`-поля методом `get()`, а обращение через синтаксис массива выбрасывает исключение.

```php
$author = \SomePartner\MyBooksCatalog\AuthorTable::query()
    ->registerRuntimeField(
        new \Bitrix\Main\ORM\Fields\ExpressionField('FULL_NAME', "CONCAT(%s, ' ', %s)", ['NAME', 'LAST_NAME'])
    )
    ->addSelect('ID')
    ->addSelect('FULL_NAME')
    ->where('ID', 17)
    ->fetchObject()
;

echo $author->get('FULL_NAME'); // 'Name 17 Last name 17'

$author['FULL_NAME']; // Выбросит ArgumentException
```
