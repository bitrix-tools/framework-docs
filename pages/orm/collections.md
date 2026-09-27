---
title: Коллекции
description: "Коллекции. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации."
---

Коллекция ORM — типизированный набор ORM-объектов одного класса. Коллекцию получают из результата запроса через `fetchCollection()`, создают вручную через класс коллекции или восстанавливают из готовых данных через `wakeUp()`.

Коллекция нужна, когда с результатом запроса нужно работать как с набором ORM-объектов, а не как с массивом строк. В отличие от массива, у коллекции есть API для доступа к объектам, отбора элементов, заполнения полей и сохранения изменений.

## Получить коллекцию

Метод `fetchCollection()` возвращает коллекцию объектов, которые соответствуют запросу. Если в запросе не указан `select`, ORM добавляет выборку всех полей. О построении запроса читайте в статье [Выборка данных](./querying-data.md).

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;
```

После `fetchCollection()` ORM возвращает объект класса коллекции. Если свой класс коллекции не задан, ORM использует сгенерированный класс-заглушку вида `EO_Book_Collection`. Такой класс наследует `Bitrix\Main\ORM\Objectify\Collection`, поэтому у него есть базовые методы коллекции: `add()`, `getByPrimary()`, `fill()`, `save()`.

Если для коллекции нужна своя логика, создайте наследника сгенерированного класса.

```php
namespace Bitrix\Main\Test\Typography;

class Books extends EO_Book_Collection
{
}
```

Затем укажите свой класс коллекции в таблице через метод `getCollectionClass()`.

```php
namespace Bitrix\Main\Test\Typography;

use Bitrix\Main\ORM\Data\DataManager;

class BookTable extends DataManager
{
    public static function getCollectionClass()
    {
        return Books::class;
    }
}
```

## Перебрать объекты коллекции

Коллекция реализует `Iterator`, поэтому ее можно передать в `foreach`.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

foreach ($books as $book)
{
    echo $book->getTitle();
}
```

Метод `walk()` выполняет callback для каждого объекта и возвращает текущую коллекцию. Используйте его в цепочке, чтобы получить объекты, изменить их и сразу сохранить.

```php
use Bitrix\Main\Test\Typography\BookTable;

$processedKeys = [];

$result = BookTable::query()
    ->where('PUBLISHER_ID', 253)
    ->fetchCollection()
    ->walk(static function($book, $key) use (&$processedKeys)
    {
        $processedKeys[] = $key;
        $book->setIsArchived(true);
    })
    ->save()
;
```

Первый аргумент callback — объект, второй — ключ элемента коллекции.

## Получить объекты из коллекции

Метод `getAll()` возвращает все объекты коллекции в виде массива.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

$bookList = $books->getAll();
echo $bookList[0]->getTitle();
```

Метод `getByPrimary()` возвращает объект по первичному ключу или `null`, если объекта нет в коллекции.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

$book = $books->getByPrimary(1);

if ($book !== null)
{
    echo $book->getTitle();
}
```

Для объекта с составным первичным ключом передайте массив, где ключи — имена полей первичного ключа.

```php
use Bitrix\Main\Test\Typography\StoreBookTable;

$storeBooks = StoreBookTable::query()
    ->where('STORE_ID', 33)
    ->fetchCollection()
;

$storeBook = $storeBooks->getByPrimary([
    'STORE_ID' => 33,
    'BOOK_ID' => 1,
]);
```

Метод `collectValues` возвращает данные объектов в виде массива. Ключами массива становятся значения первичного ключа объектов.

Аргументы метода:

-  `$valuesType` выбирает набор значений: `Values::ACTUAL` — фактические загруженные значения, `Values::CURRENT` — текущие измененные значения, `Values::ALL` — оба набора.

-  `$fieldsMask` ограничивает типы полей через маску `FieldTypeMask`. Например, `FieldTypeMask::SCALAR` оставляет в результате только скалярные поля, а `FieldTypeMask::ALL` возвращает все доступные типы полей.

-  `$recursive` включает в результат значения связанных объектов и коллекций. Если передать `false`, метод вернет только значения текущих объектов коллекции.

Используйте аргументы, чтобы выбрать, какие данные попадут в результат:

-  `collectValues()` вернет все загруженные и текущие значения полей текущих объектов.

-  `collectValues(Values::ALL, FieldTypeMask::SCALAR)` вернет только скалярные поля.

-  `collectValues(Values::CURRENT, FieldTypeMask::SCALAR)` вернет только текущие значения скалярных полей.

-  `collectValues(Values::ALL, FieldTypeMask::ALL, true)` добавит значения загруженных связанных объектов и коллекций.

```php
use Bitrix\Main\ORM\Fields\FieldTypeMask;
use Bitrix\Main\ORM\Objectify\Values;
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

$allValues = $books->collectValues();
$scalarValues = $books->collectValues(Values::ALL, FieldTypeMask::SCALAR);
$changedScalarValues = $books->collectValues(Values::CURRENT, FieldTypeMask::SCALAR);
$valuesWithRelations = $books->collectValues(Values::ALL, FieldTypeMask::ALL, true);
```

## Проверить наличие объектов

Метод `has()` проверяет, есть ли в коллекции переданный объект. Объект должен быть экземпляром того же ORM-класса, с которым работает коллекция.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

$book = $books->getByPrimary(1);

if ($book !== null && $books->has($book))
{
    echo 'Book is in collection';
}
```

Метод `hasByPrimary()` проверяет наличие объекта по первичному ключу и возвращает `true` или `false`.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

if ($books->hasByPrimary(1))
{
    echo 'Book is in collection';
}
```

Метод `isEmpty()` возвращает `true`, если коллекция не содержит объектов.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->where('PUBLISHER_ID', 999)
    ->fetchCollection()
;

if ($books->isEmpty())
{
    echo 'No books found';
}
```

Метод `count()` возвращает количество объектов в коллекции.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->where('PUBLISHER_ID', 253)
    ->fetchCollection()
;

$count = $books->count();
```

Метод `find()` возвращает первый объект, для которого callback вернул `true`. Если подходящего объекта нет, метод возвращает `null`.

Callback получает объект коллекции первым аргументом и ключ элемента вторым аргументом. Чтобы объект попал в результат, callback должен вернуть `true`.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->where('PUBLISHER_ID', 253)
    ->fetchCollection()
;

$book = $books->find(static function($book, $key)
{
    return $book->getIsbn() === '978-3-16-148410-0';
});
```

Метод `filter()` возвращает новую коллекцию с объектами, для которых callback вернул `true`. Метод работает только с неизмененной коллекцией. Если до фильтрации объекты были добавлены, удалены или изменены, ORM выбросит `Bitrix\Main\ORM\Exception\CollectionFilterException`.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->where('PUBLISHER_ID', 253)
    ->fetchCollection()
;

$archivedBooks = $books->filter(static function ($book, $key)
{
    return $book->getIsArchived();
});
```

## Изменить состав коллекции

Метод `add()` добавляет объект в коллекцию. Объект должен принадлежать тому же ORM-классу, иначе метод выбросит исключение `Bitrix\Main\ArgumentException`. Пока коллекция не сохранена через `save()`, объект остается только в коллекции и не попадает в базу данных.

```php
use Bitrix\Main\Test\Typography\Book;
use Bitrix\Main\Test\Typography\Books;

$books = new Books();

$book = (new Book())
    ->setTitle('Title 3')
    ->setIsbn('978-0-00-000000-3')
;

$books->add($book);

$saveResult = $books->save();
```

Коллекция поддерживает синтаксис `$collection[] = $object` только для добавления объекта. Доступ по индексу, проверка индекса и удаление по индексу через `ArrayAccess` не доступны.

```php
use Bitrix\Main\Test\Typography\Book;
use Bitrix\Main\Test\Typography\Books;

$books = new Books();
$books[] = (new Book())->setTitle('Title 4');

$saveResult = $books->save();
```

Метод `remove()` удаляет из коллекции переданный объект. Метод `removeByPrimary()` удаляет объект по первичному ключу. Удаление меняет состав коллекции в памяти. Метод не удаляет запись из базы данных.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

$book = $books->getByPrimary(1);

if ($book !== null)
{
    $books->remove($book);
}

$books->removeByPrimary(2);

$saveResult = $books->save();
```

## Заполнить недостающие данные

Метод `fill()` загружает поля и отношения для объектов коллекции одним запросом. В метод можно передать имя поля, массив имен полей или маску `Bitrix\Main\ORM\Fields\FieldTypeMask`.

```php
use Bitrix\Main\Test\Typography\Books;

$books = Books::wakeUp([
    ['ID' => 1],
    ['ID' => 2],
]);

$books->fill(['TITLE', 'PUBLISHER_ID']);
```

Если передать одно поле, `fill()` может вернуть результат заполнения этого поля. Для обычного поля метод возвращает список значений, для поля отношения — коллекцию связанных объектов.

```php
use Bitrix\Main\Test\Typography\Books;

$books = Books::wakeUp([
    ['ID' => 1],
    ['ID' => 2],
]);

$titles = $books->fill('TITLE');
$publishers = $books->fill('PUBLISHER');
```

Маски `FieldTypeMask` помогают выбрать группу полей.

```php
use Bitrix\Main\ORM\Fields\FieldTypeMask;
use Bitrix\Main\Test\Typography\Books;

$books = Books::wakeUp([
    ['ID' => 1],
    ['ID' => 2],
]);

$books->fill(FieldTypeMask::FLAT);
```

Доступные маски:

#|
|| **Маска** | **Что заполняет** ||
|| `SCALAR` | Скалярные поля ||
|| `EXPRESSION` | Вычисляемые поля `ExpressionField` ||
|| `USERTYPE` | Пользовательские поля ||
|| `REFERENCE` | Отношения `Reference` ||
|| `ONE_TO_MANY` | Отношения `OneToMany` ||
|| `MANY_TO_MANY` | Отношения `ManyToMany` ||
|| `FLAT` | Скалярные и вычисляемые поля ||
|| `RELATION` | Все отношения ||
|| `ALL` | Все доступные поля и отношения ||
|#

## Сохранить объекты

Метод `save($ignoreEvents = false)` сохраняет новые и измененные объекты коллекции и возвращает объект `Bitrix\Main\ORM\Data\Result`.

```php
use Bitrix\Main\Test\Typography\Book;
use Bitrix\Main\Test\Typography\Books;

$books = new Books();

$books[] = (new Book())
    ->setTitle('Title 3')
    ->setIsbn('978-0-00-000000-3')
;

$books[] = (new Book())
    ->setTitle('Title 4')
    ->setIsbn('978-0-00-000000-4')
;

$result = $books->save();
```

Новые объекты ORM сохраняет через групповое добавление. Если измененные объекты содержат одинаковый набор новых значений, ORM может сохранить их через групповое обновление. Если изменения различаются, ORM сохраняет объекты по отдельности.

```php
use Bitrix\Main\Test\Typography\BookTable;
use Bitrix\Main\Test\Typography\PublisherTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

$publisher = PublisherTable::wakeUpObject(['ID' => 254]);

foreach ($books as $book)
{
    $book->setPublisher($publisher);
}

$result = $books->save();
```

Параметр `$ignoreEvents` передается в операции добавления и группового обновления. Значение по умолчанию — `false`: события ORM не отключаются.

```php
use Bitrix\Main\Test\Typography\Book;
use Bitrix\Main\Test\Typography\Books;

$books = new Books();

$books[] = (new Book())
    ->setTitle('Title 5')
    ->setIsbn('978-0-00-000000-5')
;

$result = $books->save(true);
```

## Получить значения и связанные коллекции

Для скалярного поля ORM генерирует метод `get*List()`, где `*` — имя поля в формате `CamelCase` с заглавной буквы. Метод возвращает список значений этого поля из объектов коллекции.

Метод работает с уже загруженными значениями. Укажите поле в `addSelect()` или `setSelect()` при запросе. Если поле не выбрано, метод вернет пустой список.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->whereIn('ID', [1, 2])
    ->fetchCollection()
;

$titles = $books->getTitleList();
```

Для поля отношения ORM генерирует метод `get*Collection()`. Метод возвращает коллекцию уникальных связанных объектов.

Отношение тоже должно быть выбрано через `addSelect()` или `setSelect()`. Если отношение не загружено, метод вернет пустую коллекцию.

```php
use Bitrix\Main\Test\Typography\AuthorTable;

$authors = AuthorTable::query()
    ->addSelect('BOOKS')
    ->fetchCollection()
;

$books = $authors->getBooksCollection();
```

Метод доступен для отношений `Reference`, `OneToMany` и `ManyToMany`.

## Восстановить коллекцию из данных

Метод `wakeUp()` создает коллекцию из готовых данных без запроса к базе. В каждом элементе данных должен быть первичный ключ объекта.

```php
use Bitrix\Main\Test\Typography\Books;

$books = Books::wakeUp([
    ['ID' => 1, 'TITLE' => 'Title 1'],
    ['ID' => 2, 'TITLE' => 'Title 2'],
]);
```

Для объектов с составным первичным ключом укажите все поля ключа.

```php
use Bitrix\Main\Test\Typography\EO_StoreBook_Collection;

$storeBooks = EO_StoreBook_Collection::wakeUp([
    [
        'STORE_ID' => 33,
        'BOOK_ID' => 1,
        'QUANTITY' => 4,
    ],
    [
        'STORE_ID' => 33,
        'BOOK_ID' => 2,
        'QUANTITY' => 0,
    ],
]);
```

{% note warning "" %}

`wakeUp()` не проверяет, что объект уже есть в базе данных. Используйте метод для данных, которые уже получены из надежного источника, например из кеша или предыдущего запроса.

{% endnote %}

## Объединить коллекции

Метод `merge()` добавляет в текущую коллекцию объекты из другой коллекции и возвращает текущую коллекцию. Переданная коллекция должна быть того же класса. Если передать `null`, метод вернет текущую коллекцию без изменений.

```php
use Bitrix\Main\Test\Typography\BookTable;

$books = BookTable::query()
    ->where('ID', 1)
    ->fetchCollection()
;

$otherBooks = BookTable::query()
    ->where('ID', 2)
    ->fetchCollection()
;

$books->merge($otherBooks);
```

При объединении ORM добавляет объекты по тем же правилам, что и метод `add()`: объект другого класса не попадет в коллекцию.
