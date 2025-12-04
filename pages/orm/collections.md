---
title: Коллекции
description: 'Коллекции. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Коллекция -- специальный тип массива, который оптимизирует работу с объектами одного типа. Она позволяет выполнять групповые операции более эффективно.

Основные характеристики коллекции:

1. Типизация. Коллекция содержит объекты одного типа, что делает операции более эффективными и безопасными.

2. Оптимизация. Коллекции ускоряют выполнение операций, таких как добавление и удаление объектов.

3. Удобство. Коллекции упрощают код, предоставляя высокоуровневый интерфейс для работы с группами объектов.

Чтобы работать с коллекцией объектов, необходимо сначала описать сущность. Метод `fetchCollection` извлекает из базы данных коллекцию объектов одного типа. Это удобно для работы с однородными данными. В отличие от `fetchAll` или циклического `fetch`, которые возвращают данные в виде массива.

```php
$books = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->fetchCollection();
```

`$books` -- это коллекция объектов класса `Book` с методами для групповых операций.

## Класс коллекции

У каждой сущности есть свой класс коллекции, наследуемый от `Bitrix\Main\ORM\Objectify\Collection`. Класс создается автоматически. Для объектов `Book` он имеет название `EO_Book_Collection`, где `EO_` -- это аббревиатура от `EntityObject`*.* Префикс `EO_` добавлен для уникальности , чтобы предотвратить конфликты с существующими классами.

Чтобы задать свой класс, создайте наследника и укажите его в классе `Table` сущности.

```php
// Файл bitrix/modules/main/lib/test/typography/books.php
namespace Bitrix\Main\Test\Typography;
class Books extends EO_Book_Collection
{
}
```

-  Класс `Books` наследует класс `EO_Book_Collection`.

```php
// Файл bitrix/modules/main/lib/test/typography/booktable.php
namespace Bitrix\Main\Test\Typography;
class BookTable extends Bitrix\Main\ORM\Data\DataManager
{
    public static function getCollectionClass()
    {
        return Books::class;
    }
    //...
}
```

-  Класс `BookTable` наследует класс `Bitrix\Main\ORM\Data\DataManager`.

-  Cтатический метод `getCollectionClass` возвращает `Books` -- имя класса коллекции, связанной с `BookTable`.

Теперь метод `fetchCollection` возвращает коллекцию `Books`, что упрощает работу с объектами `Book`.

## Доступ к элементам коллекции

Коллекции предоставляют методы, которые позволяют перебрать элементы, получить доступ к объектам и выполнить операции с ними.

### Как перебрать элементы коллекции

Коллекция реализует интерфейс `\Iterator`, что позволяет использовать цикл `foreach` для перебора элементов.

```php
$books = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->fetchCollection();
foreach ($books as $book) {
    // ...
}
```

### Как получить объекты коллекции

Объекты коллекции можно получить напрямую. Метод `getAll` возвращает все объекты в виде массива.

```php
$books = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->fetchCollection();
$bookObjects = $books->getAll();
echo $bookObjects[0]->getId();
// выведет значение ID первого объекта
```

Если нужно получить не сами объекты, а их данные в виде массива, следует использовать метод `collectValues`. Метод преобразует коллекцию в ассоциативный массив, где ключами являются первичные ключи объектов, а значениями -- массивы данных, полученные из каждого объекта. Если элементы коллекции имеют составной первичный ключ, он будет преобразован в строку с использованием правил `\Bitrix\Main\ORM\Objectify\Collection::sysGetPrimaryKey`.

```php
$bookCollection = \Bitrix\Main\Test\Typography\BookTable::getList() ->fetchCollection(); 
$books = $bookCollection->collectValues();
```

Чтобы получить объекты по ключам, используйте метод `getByPrimary`. Если объект с указанным первичным ключом не будет найден, то метод вернет `null`. При работе с составным первичным ключом используйте ассоциативный массив с именами полей ключа.

```php
// Пример с простым первичным ключом
$books = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->fetchCollection();
$book = $books->getByPrimary(1);
// книга с ID=1

// Пример с составным первичным ключом
$booksToAuthor = \Bitrix\Main\Test\Typography\BookAuthorTable::getList()
    ->fetchCollection();
$bookToAuthor = $booksToAuthor->getByPrimary(['BOOK_ID' => 2, 'AUTHOR_ID' => 18]);
// объект отношения книги ID=2 с автором ID=18
```

### Проверить наличие объекта

Метод `has` позволяет проверить наличие объекта в коллекции напрямую.

```php
$book1 = \Bitrix\Main\Test\Typography\Book::wakeUp(1);
$book2 = \Bitrix\Main\Test\Typography\Book::wakeUp(2);
$books = \Bitrix\Main\Test\Typography\BookTable::query()
    ->addSelect('*')
    ->whereIn('ID', [2, 3, 4])
    ->fetchCollection();
var_dump($books->has($book1)); // false
var_dump($books->has($book2)); // true
```

Метод `hasByPrimary` проверяет по первичному ключу.

```php
$books = \Bitrix\Main\Test\Typography\BookTable::query()
    ->addSelect('*')
    ->whereIn('ID', [2, 3, 4])
    ->fetchCollection();
var_dump($books->hasByPrimary(1)); // false
var_dump($books->hasByPrimary(2)); // true
```

Метод `isEmpty` проверяет, пустая ли коллекция. Это полезно для уверенности в наличии объектов перед выполнением операций.

```php
$books = \Bitrix\Main\Test\Typography\BookTable::query()
    ->addSelect('*')
    ->whereIn('ID', [2, 3, 4])
    ->fetchCollection();
$isEmpty = $books->isEmpty();
```

### Как добавить объект

Добавить объект в коллекцию можно с помощью метода `add` и интерфейса `ArrayAccess`. Интерфейс позволяет использовать синтаксис массива `[]`.

```php
$book1 = \Bitrix\Main\Test\Typography\Book::wakeUp(1);
$books = \Bitrix\Main\Test\Typography\BookTable::query()
    ->addSelect('*')
    ->whereIn('ID', [2, 3, 4])
    ->fetchCollection();
$books->add($book1);
// или
$books[] = $book1;
```

### Удалить объект

Метод `remove` удаляет объект из коллекции явно. Вы передаете сам объект, который хотите удалить. Метод `removeByPrimary` удаляет объект по первичному ключу. Это удобно, если у вас есть идентификатор объекта, но нет самого объекта.

```php
$book1 = \Bitrix\Main\Test\Typography\Book::wakeUp(1);
$books = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->fetchCollection();
$books->remove($book1);
// удалится книга с ID=1
$books->removeByPrimary(2);
// удалится книга с ID=2
```

## Групповые действия

Коллекции позволяют выполнять групповые операции над элементами.

### Сохранить новые объекты

Метод `save()` сохраняет новые объекты одним запросом к базе данных.

```php
use \Bitrix\Main\Test\Typography\Books;
use \Bitrix\Main\Test\Typography\Book;
$books = new Books;
$books[] = (new Book)->setTitle('Title 112');
$books[] = (new Book)->setTitle('Title 113');
$books[] = (new Book)->setTitle('Title 114');
$books->save(true);
// INS ERT INTO ... (`TITLE`, `ISBN`) VALUES
// ('Title 112', DEFAULT),
// ('Title 113', DEFAULT),
// ('Title 114', '114-000')
```

Параметр `$ignoreEvents = true` отключает события ORM при добавлении записей. Это полезно при мультивставке с автоинкрементным полем, так как невозможно получить множественные значения этого поля, как при вставке одной записи. Если в сущности нет автоинкрементных полей, выполнение событий остается на усмотрение разработчика. По умолчанию события выполняются.

### Обновить существующие объекты

Метод `save()` сохраняет измененные объекты одним запросом `UPDATE`.

```php
use \Bitrix\Main\Test\Typography\PublisherTable;
use \Bitrix\Main\Test\Typography\BookTable;
$books = BookTable::getList()->fetchCollection();
$publisher = PublisherTable::wakeUpObject(254);
foreach ($books as $book) {
    $book->setPublisher($publisher);
}
$books->save();
// UPDATE ... SET `PUBLISHER_ID` = '254'
    WHERE `ID` IN ('1', '2')
```

Групповое обновление работает, если измененные данные одинаковы для всех объектов. Если данные различаются для каждого объекта, записи сохраняются по отдельности, что может привести к множественным запросам в базу данных.

Как и при добавлении, при обновлении можно отключать выполнение событий параметром `$ignoreEvents` в методе `save()`. По умолчанию они выполняются для каждого элемента коллекции. Отключение событий может повысить производительность при массовых операциях, так как исключает вызов дополнительных обработчиков.

### Заполнить данные

Операция `fill` заполняет данные объектов одним запросом. Метод `fill` выполняет массовое заполнение данных без валидации. Это может привести к ошибкам, если данные некорректны.

```php
$books = new \Bitrix\Main\Test\Typography\Books;
$books[] = \Bitrix\Main\Test\Typography\Book::wakeUp(1);
$books[] = \Bitrix\Main\Test\Typography\Book::wakeUp(2);
$books->fill();
// SELECT ... WHERE ID IN(1,2)
```

Можно передавать массив имен полей или маску типа.

```php
$books->fill(['TITLE', 'PUBLISHER_ID']);
$books->fill(\Bitrix\Main\ORM\Fields\FieldTypeMask::FLAT);
```

Доступные маски:

-  `SCALAR`  -- скалярные поля `ORM\ScalarField`,

-  `EXPRESSION` -- выражения `ORM\ExpressionField`,

-  `USERTYPE` -- пользовательские поля,

-  `REFERENCE` -- отношения 1:1 и N:1 `ORM\Fields\Relations\Reference`,

-  `ONE_TO_MANY` -- отношения 1:N `ORM\Fields\Relations\OneToMany`,

-  `MANY_TO_MANY` -- отношения N:M `ORM\Fields\Relations\ManyToMany`,

-  `FLAT` -- скалярные поля и выражения,

-  `RELATION` -- все отношения,

-  `ALL` -- абсолютно все доступные поля.

### Получить список значений поля

Метод `get*List` позволяет получить список значений поля из результата запроса, где `*` -- имя поля в формате `camelCase` с заглавной буквы.

```php
$books = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->fetchCollection();
$titles = $books->getTitleList();
```

### Получить коллекцию

Метод `get*Collection` возвращает уникальные объекты в виде коллекции, где `*` -- имя поля в формате `camelCase` с заглавной буквы. Метод доступен только для полей отношений: `Reference`, `OneToMany`, `ManyToMany` .

```php
$authors = \Bitrix\Main\Test\Typography\AuthorTable::getList([
    'select' => ['BOOKS']
])
->fetchCollection();

// Получаем уникальную коллекцию книг всех авторов
$books = $authors->getBooksCollection();
```

## Как восстановить коллекцию

Метод `wakeUp`  восстанавливает коллекцию объектов из имеющихся данных без повторного запроса к базе. Коллекцию можно восстановить по первичному ключу или по набору полей.

При восстановлении коллекции по набору полей необходимо указать первичный ключ. Это обязательное поле.

```php
// По первичному ключу
$books = \Bitrix\Main\Test\Typography\Books::wakeUp([1, 2]);
// По набору полей
$books = \Bitrix\Main\Test\Typography\Books::wakeUp([
    ['ID' => 1, 'TITLE' => 'Title 1'],
    ['ID' => 2, 'TITLE' => 'Title 2']
]);
```

{% note info "" %}

Если объекты не существовали в базе данных и были восстановлены через `wakeUp`, то можно сохранить только измененные после `wakeUp` объекты. Чтобы сохранить изменения, следует использовать запрос `UPDATE`.

{% endnote %}

## Как выполнить слияние

Метод `merge` позволяет объединить две коллекции в одну. Слияние происходит по правилам, которые определены в `\Bitrix\Main\ORM\Objectify\Collection::add`.

```php
$books = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->whereIn('ID', [1, 2])
	->fetchCollection();

$anotherBooks = \Bitrix\Main\Test\Typography\BookTable::getList()
    ->whereIn('ID', [3, 4])
	->fetchCollection();

$books = $books->merge($anotherBooks);
```
