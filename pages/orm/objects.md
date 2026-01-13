---
title: Объекты
description: 'Объекты. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

В Bitrix Framework объект представляет собой экземпляр класса. Класс соответствует записи в базе данных. Это позволяет работать с данными в виде объектов, а не массивов, что делает код более удобным.

Чтобы использовать объекты, необходимо сначала описать сущность. Метод `fetchObject` получает объект сущности из базы данных. В отличие от метода `fetch`, который возвращает данные в виде массива, `fetchObject` возвращает данные в виде объекта.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
```

Теперь `$book` -- это объект сущности `Book`, который предоставляет методы для работы с данными книги и ее связями с другими сущностями. Методы объекта можно использовать для получения и изменения данных, например, `$book->getTitle()` для получения названия книги или `$book->setTitle('New Title')` для его изменения.

## Класс объекта

Каждый объект сущности наследует класс `Bitrix\Main\ORM\Objectify\EntityObject`. Это означает, что у каждой сущности есть свой класс объектов, который создается автоматически.

Для объекта сущности `Book` создается класс `EO_Book`. Он находится в том же пространстве имен, что и класс `BookTable`, но вместо суффикса `Table` имеет префикс `EO_` (сокращенно от `EntityObject`)*.* Префикс `EO_` добавлен для уникальности, чтобы предотвратить конфликты с существующими классами.

### Как создать свой класс

Если необходимо использовать собственное имя класса или добавить дополнительный функционал, можно создать свой класс объекта.

```php
// Файл bitrix/modules/main/lib/test/typography/book.php
namespace Bitrix\Main\Test\Typography;

class Book extends EO_Book
{
    // Здесь можно добавить свои методы и функционал
}
```

-  Класс `Book` наследует базовый класс `EO_Book`.

```php
// Файл bitrix/modules/main/lib/test/typography/booktable.php
namespace Bitrix\Main\Test\Typography;

class BookTable extends Bitrix\Main\ORM\Data\DataManager
{
    public static function getObjectClass()
    {
        return Book::class;
    }
    //...
}
```

-  Класс `BookTable` наследует класс `Bitrix\Main\ORM\Data\DataManager` и управляет взаимодействием с базой данной для сущности «Книга».

-  Метод `getObjectClass` определяет, что каждая запись из таблицы будет представлена как объект класса `Book`.

Теперь метод `fetchObject` будет возвращать объекты вашего класса `Bitrix\Main\Test\Typography\Book`.

### Рекомендации

-  Чтобы использовать конкретное имя или расширить функционал, нужно определить собственный класс объектов.

-  Стандартные имена классов, такие как `instanceof EO_Book`, `new EO_Book` или `EO_Book::class`, не следует использовать. Лучше описать свой класс с подходящим именем или использовать обезличенные методы `BookTable::getObjectClass()`, `BookTable::createObject()`, `BookTable::wakeUpObject()`.

-  В своем классе можно добавлять функционал и переопределять методы. Свойства с именами `primary`, `entity` и `dataClass` не рекомендуется описывать, так как они уже используются базовым классом.

## Именованные методы

Большинство методов для работы с полями сущностей именованные. Это значит, что для каждого поля доступны персональные методы: `getTitle`, `setTitle`, `remindActualTitle` и другие.

```php
$book->getTitle();
$book->setTitle($value);
$book->remindActualTitle();
$book->resetTitle();
// и так далее
```

### Особенности именованных методов

-  Инкапсуляция. Позволяет контролировать доступ к каждому полю индивидуально.

-  Удобство. Не нужно запоминать названия полей, IDE подскажет их и ускорит ввод с помощью автодополнения.

-  Читаемость. Код выглядит целостно и понятно.

### Универсальные методы

Существуют универсальные методы: `getTitle`, `setTitle`, `remindActualTitle` и другие. Они принимают имя поля, например, `$fieldName`, как аргумент.

```php
$fieldName = 'TITLE';
$book->get($fieldName);
$book->set($fieldName, $value);
$book->remindActual($fieldName);
$book->reset($fieldName);
// и так далее
```

Имена полей хранятся в переменных, что позволяет работать с полями обезличенно.

Если для объекта создан собственный класс и переопределен именованный метод, то универсальный метод вызовет измененный метод.

```php
namespace Bitrix\Main\Test\Typography;

class Book extends EO_Book
{
    public function getTitle()
    {
        return 'custom title';
    }
}

$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();

echo $book->getTitle(); // 'custom title'
echo $book->get('TITLE'); // 'custom title'
```

Исключение -- метод `fill`. Он не вызывает именованные методы, так как оптимизирован для работы с базой данных и заполнения нескольких полей одновременно.

### Магические методы

Именованные методы реализованы с помощью магического метода `__call`. Это позволяет автоматически обрабатывать все поля без ручного описания. Такой подход экономит память и устраняет необходимость кеширования сгенерированных классов.

Недостаток магических методов -- повышенная нагрузка на процессор. Это можно решить, явно определив часто используемые методы как `getId` в базовом классе. Процессорные ресурсы проще масштабировать горизонтально, добавляя новые машины.

## Приведение типов

В объектах значения строго приводятся к типу поля. Это значит, что числа всегда остаются числами, а строки -- строками.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
var_dump($book->getId()); // int 1
var_dump($book->getTitle()); // string 'Title 1' (length=7)
```

Поля типа `BooleanField` ожидают значения `true` или `false`. Если в базе данных такие значения представлены как `Y` или `N`, они автоматически преобразуются.

```php
// (new BooleanField('IS_ARCHIVED'))
//     ->configureValues('N', 'Y'),

$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
var_dump($book->getIsArchived()); // boolean true

// При установке значений также ожидается boolean
$book->setIsArchived(false);
```

## Как прочитать данные объекта

Методы чтения данных позволяют получать значения полей, проверять их наличие и отслеживать изменения.

### get

Метод возвращает значение поля или `null`, если поле отсутствует (например, если оно не указано в `select`).

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
$title = $book->getTitle();
```

### require

Метод можно использовать, если поле должно быть заполнено. Если поле пустое, сценарий не будет выполнен, и будет выведена ошибка.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
$title = $book->requireTitle();
```

В данном случае результат `requireTitle()` не будет отличаться от вызова `getTitle()`, так как поле `TITLE` заполнено. В следующем примере поле не заполнено, поэтому будет выброшено исключение.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1, ['select' => ['ID', 'PUBLISHER_ID', 'ISBN']])
    ->fetchObject();
$title = $book->requireTitle();
// SystemException: "TITLE value is required for further operations"
```

### remindActual

Метод позволяет отличить оригинальное значение от измененного, но еще не сохраненного.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
echo $book->getTitle(); // "Title 1"
$book->setTitle("New title");
echo $book->getTitle(); // "New title"
echo $book->remindActualTitle(); // "Title 1"
```

Можно использовать универсальные методы, если имена полей хранятся в переменных.

```php
$fieldName = 'TITLE';
$title = $book->get($fieldName);
$title = $book->require($fieldName);
$title = $book->remindActual($fieldName);
```

### primary

Метод `primary` реализован в виде виртуального свойства, доступного только для чтения. Он возвращает значения первичного ключа.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
$primary = $book->primary; // ['ID' => 1]
$id = $book->getId(); // 1
```

### collectValues

Метод `collectValues` возвращает все значения объекта в виде массива.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
$values = $book->collectValues();
```

Можно использовать фильтры для уточнения набора полей и типа данных.

```php
$values = $book->collectValues(\Bitrix\Main\ORM\Objectify\Values::ACTUAL);
$values = $book->collectValues(\Bitrix\Main\ORM\Objectify\Values::CURRENT);
$values = $book->collectValues(\Bitrix\Main\ORM\Objectify\Values::ALL);
```

Вторым аргументом передается маска, определяющая типы полей.

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

Для `runtime` полей используется только универсальный метод `get`.

```php
$author = \Bitrix\Main\Test\Typography\AuthorTable::query()
    ->registerRuntimeField(
        new \Bitrix\Main\Entity\ExpressionField(
            'FULL_NAME', 'CONCAT(%s, " ", %s)', ['NAME', 'LAST_NAME']
        )
    )
    ->addSelect('ID')
    ->addSelect('FULL_NAME')
    ->where('ID', 17)
    ->fetchObject();
echo $author->get('FULL_NAME'); // 'Name 17 Last name 17'
```

Значения `runtime` полей изолированы от штатных полей, поэтому другие методы для них неактуальны.

## Записать данные объекта

Методы записи позволяют устанавливать, отменять и удалять значения.

### set

Метод `set` устанавливает новое значение для поля.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
$book->setTitle("New title");
```

Объект запоминает исходные значения.

```php
$book->getTitle(); // текущее значение
$book->remindActualTitle(); // актуальное значение
```

Значения первичного ключа `primary` можно установить только в новых объектах. В существующих объектах изменить его нельзя. Для этого следует создать новый объект и удалить старый. Поля `Bitrix\Main\ORM\Fields\ExpressionField` не изменяются вручную, так как их значения рассчитываются автоматически.

Если новое значение не отличается от актуального, оно не изменится. Такое значение не будет включено в SQL-запрос при сохранении.

### reset

Метод `reset` отменяет установку нового значения и возвращает исходное.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
echo $book->getTitle(); // "Title 1"
$book->setTitle("New title");
echo $book->getTitle(); // "New title"
$book->resetTitle();
echo $book->getTitle(); // "Title 1"
```

### unset

Метод `unset` удаляет значение объекта, как будто оно не выбиралось и не устанавливалось.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
echo $book->getTitle(); // "Title 1"
$book->unsetTitle();
echo $book->getTitle(); // null
```

Можно использовать универсальные методы с именем поля.

```php
$fieldName = 'TITLE';
$book->set($fieldName, "New title");
$book->reset($fieldName);
$book->unset($fieldName);
```

Все изменения происходят только во время сеанса. Чтобы сохранить их в базе данных, объект нужно сохранить.

## Проверить значения полей

В Bitrix Framework есть методы для проверки полей объектов. Они определяют, заполнены ли поля, изменялись ли они или содержат значения.

### isFilled

Метод `isFilled` проверяет, содержит ли объект актуальное значение из базы данных.

```php
use \Bitrix\Main\Test\Typography\Book;
// актуальными считаются значения из методов fetch* и wakeUp
// в примере при инициализации объекта передается только первичный ключ
$book = Book::wakeUp(1);
var_dump($book->isTitleFilled()); // false
$book->fillTitle();
var_dump($book->isTitleFilled()); // true
```

### isChanged

Метод `isChanged` определяет, было ли установлено новое значение в течение сеанса.

```php
use \Bitrix\Main\Test\Typography\Book;
// объект может иметь исходное значение, а может и не иметь
// это не повлияет на дальнейшее поведение
$book = Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);
var_dump($book->isTitleChanged()); // false
$book->setTitle('New title 1');
var_dump($book->isTitleChanged()); // true
```

Этот метод также применим к новым объектам, пока их значения не сохранены в базе данных.

### has

Метод `has` проверяет, есть ли в объекте какое-либо значение поля -- актуальное из базы данных или установленное в сеансе. Это эквивалентно `isFilled() || isChanged()`.

```php
use \Bitrix\Main\Test\Typography\Book;

$book = Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);
$book->setIsArchived(true);
var_dump($book->hasTitle()); // true
var_dump($book->hasIsArchived()); // true
var_dump($book->hasIsbn()); // false
```

## Проверить состояние объекта

Объект может находиться в одном из трех состояний:

-  `RAW` -- новый. Объект только что создан, и его данные еще не были сохранены в базе данных.

-  `ACTUAL` -- актуальный. Данные объекта совпадают с теми, что хранятся в базе данных.

-  `CHANGED` -- измененный. Данные объекта были изменены и отличаются от тех, что хранятся в базе данных.

-  `DELETED` -- удаленный. Объект был удален из базы данных.

Переход между состояниями происходит автоматически на основе изменений данных. Состояние объекта можно проверить с помощью публичного read-only свойства `state` и констант класса `\Bitrix\Main\ORM\Objectify\State`.

```php
use \Bitrix\Main\Test\Typography\Book;
use \Bitrix\Main\ORM\Objectify\State;

$book = new Book;
$book->setTitle('New title');
var_dump($book->state === State::RAW); // true

$book->save();
var_dump($book->state === State::ACTUAL); // true

$book->setTitle('Another one title');
var_dump($book->state === State::CHANGED); // true

$book->delete();
var_dump($book->state === State::DELETED); // true
```

## Сохранить объект

Для сохранения изменений объекта в базе данных используется метод `save`. Этот метод фиксирует все изменения в объекте, и обновляет данные в базе данных.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
$book->setTitle("New title");
$book->save();
```

{% note info "" %}

Если выполнить этот пример с тестовой сущностью из пространства имен `Bitrix\Main\Test\Typography`, то можно получить SQL-ошибку. Это связано с тем, что  тестовые данные могут быть неполными или содержать некорректные значения. Однако часть запроса с данными будет построена корректно.

{% endnote %}

После сохранения все текущие значения объекта становятся актуальными.

```php
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
echo $book->remindActualTitle(); // "Title 1"
$book->setTitle("New title");
echo $book->remindActualTitle(); // "Title 1"
$book->save();
echo $book->remindActualTitle(); // "New title"
```

### Как создать новый объект

Есть два способа создания новых объектов.

1. Прямое создание объекта.

   ```php
   $newBook = new \Bitrix\Main\Test\Typography\Book;
   $newBook->setTitle('New title');
   $newBook->save();
   
   $newAuthor = new \Bitrix\Main\Test\Typography\EO_Author;
   $newAuthor->setName('Some name');
   $newAuthor->save();
   ```

   Этот способ подходит как для стандартных классов с префиксом `EO_`, так и для собственных классов. Если вы сначала использовали стандартный класс, а затем создали свой, переписывать код не нужно -- обратная совместимость сохранится. Системный класс с префиксом `EO_` станет алиасом вашему классу.

2. Использование фабрики сущности.

   ```php
   $newBook = \Bitrix\Main\Test\Typography\BookTable::createObject();
   $newBook->setTitle('New title');
   $newBook->save();
   ```

   В новом объекте автоматически устанавливаются значения по умолчанию, описанные в маппинге `getMap`. Для создания объекта без этих значений следует передать соответствующий аргумент в конструктор.

   ```php
   $newBook = new \Bitrix\Main\Test\Typography\Book(false);
   $newBook = \Bitrix\Main\Test\Typography\BookTable::createObject(false);
   ```

Состояние значений меняется аналогично редактированию. До сохранения значения считаются текущими, после сохранения в базе данных переходят в статус актуальных.

## Удалить объект

Метод `delete()` удаляет объект из базы данных.

```php
// Удаление записи
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(1)
    ->fetchObject();
$book->delete();

// Удаление по primary ключу
$book = \Bitrix\Main\Test\Typography\Book::wakeUp(1);
$book->delete();
```

Метод `delete()` удаляет только ту запись, которая соответствует конкретному объекту. Если нужно удалить или изменить связанные данные, это необходимо сделать явно.

При удалении объекта через метод `delete()` срабатывают все необходимые события. Дополнительные действия можно описать в обработчике события `onDelete`.

## Восстановить объект

Метод `wakeUp`  восстанавливает объект из имеющихся данных без повторного запроса к базе. Это удобно, когда есть данные записи, и нужно создать объект на их основе.

Объект можно восстановить с помощью значения первичного ключа.

```php
$book = \Bitrix\Main\Test\Typography\Book::wakeUp(1);
```

Помимо первичного ключа, разрешается указать частичный или полный набор данных.

```php
$book = \Bitrix\Main\Test\Typography\Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1', 'PUBLISHER_ID' => 253]);
```

Метод `wakeUp` можно использовать как для классов с префиксом `EO_`, так и для вызова непосредственно из сущности.

```php
// Свой класс
$book = \Bitrix\Main\Test\Typography\Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);

// Системный класс
$book = \Bitrix\Main\Test\Typography\EO_Book::wakeUp(['ID' => 1, 'TITLE' => 'Title 1']);

// Через фабрику сущности
$book = \Bitrix\Main\Test\Typography\BookTable::wakeUpObject(['ID' => 1, 'TITLE' => 'Title 1']);
```

В `wakeUp` можно передавать не только скалярные значения, но и значения отношений. Значения отношений позволяют восстановить связанные объекты, например, издателя книги или авторов.

```php
$book = \Bitrix\Main\Test\Typography\Book::wakeUp([
    'ID' => 2,
    'TITLE' => 'Title 2',
    'PUBLISHER' => ['ID' => 253, 'TITLE' => 'Publisher Title 253'],
    'AUTHORS' => [
        ['ID' => 17, 'NAME' => 'Name 17'],
        ['ID' => 18, 'NAME' => 'Name 18']
    ]
]);
```

## Заполнить объект

Чтобы дозаполнить объект с неполными данными, нужно использовать  именованный метод `fill`.

```php
// Изначально у нас есть только ID и NAME
$author = \Bitrix\Main\Test\Typography\EO_Author::wakeUp(
    ['ID' => 17, 'NAME' => 'Name 17']
);
// Добавляем LAST_NAME из базы данных
$author->fillLastName();
```

Метод `fill` позволяет корректно дозаполнить объект, считая данные актуальными.

Кроме именованных методов, существует универсальный метод `fill`, который предоставляет больше возможностей.

```php
$author = \Bitrix\Main\Test\Typography\EO_Author::wakeUp(17);

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

Маски бывают:

-  `SCALAR` -- скалярные поля `ORM\ScalarField`,

-  `EXPRESSION` -- выражения `ORM\ExpressionField`,

-  `USERTYPE` -- пользовательские поля,

-  `REFERENCE` -- отношения 1:1 и N:1 `ORM\Fields\Relations\Reference`,

-  `ONE_TO_MANY` -- отношения 1:N `ORM\Fields\Relations\OneToMany`,

-  `MANY_TO_MANY` -- отношения N:M `ORM\Fields\Relations\ManyToMany`,

-  `FLAT` -- скалярные поля и выражения,

-  `RELATION` -- все отношения,

-  `ALL` -- все доступные поля.

Если нужно дозаполнить несколько объектов, используйте метод для коллекции объектов вместо выполнения операций в цикле. Это минимизирует количество запросов к базе данных.

## Как управлять отношениями

Для управления связями между объектами используются специальные методы. Эти методы позволяют добавлять, удалять и очищать связи между объектами, такими как книги и издатели.

Для работы с отношениями предназначены методы `addTo`, `removeFrom` и `removeAll`. Изменения связей необходимо выполнять через эти методы, а не напрямую через объект коллекции, чтобы изменения были корректно зафиксированы.

### addTo

Метод `addTo` добавляет новую связь между объектами. Например, можно добавить книгу к издателю.

```php
// Инициализация издателя
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::getByPrimary(253)
    ->fetchObject();
// Инициализация книги
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(2)
    ->fetchObject();
// Добавление книги в коллекцию отношения
$publisher->addToBooks($book);
// Сохранение
$publisher->save();
```

Метод `addTo` связывает объекты только в памяти. Чтобы изменения вступили в силу, необходимо вызвать метод `save`.

### removeFrom

Метод `removeFrom` удаляет конкретную связь между объектами. Например, можно удалить книгу из списка книг издателя.

```php
// Инициализация издателя
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::getByPrimary(253)
    ->fetchObject();
// Инициализация книги
$book = \Bitrix\Main\Test\Typography\BookTable::getByPrimary(2)
    ->fetchObject();
// Удаление одной конкретной книги издателя
$publisher->removeFromBooks($book);
// Сохранение
$publisher->save();
```

Метод `removeFrom` удаляет связь только в памяти. После `removeFrom` необходимо вызвать метод `save`.

### removeAll

Метод `removeAll` удаляет все связи для указанного поля. Например, можно удалить все книги, связанные с издателем.

```php
// Инициализация издателя
$publisher = \Bitrix\Main\Test\Typography\PublisherTable::getByPrimary(253)
    ->fetchObject();
    
// Удаление всех книг издателя
$publisher->removeAllBooks();
// Сохранение
$publisher->save();
```

Для такой операции необходимо знать исходные значения -- какие книги у издателя есть в данный момент. Если значение поля `BOOKS` не было выбрано изначально, оно будет выбрано автоматически перед удалением.

Метод `removeAll` удаляет связи только в памяти. После `removeAll` необходимо вызвать метод `save`.

### Универсальные методы

Вы также можете использовать универсальные методы, указывая имя поля.

```php
$fieldName = 'BOOKS';
$publisher->addTo($fieldName, $book);
$publisher->removeFrom($fieldName, $book);
$publisher->removeAll($fieldName);
```

## Интерфейс ArrayAccess

Интерфейс `ArrayAccess` позволяет работать с объектами так, как если бы они были массивами. Это упрощает переход от использования массивов к объектам, сохраняя привычный синтаксис.

Пример использования `ArrayAccess`:

```php
$author = \Bitrix\Main\Test\Typography\AuthorTable::getByPrimary(17)->fetchObject();

echo $author['NAME'];
// Аналогично вызову метода $author->getName()

$author['NAME'] = 'New name';
// Аналогично вызову метода $author->setName('New name')
```

Таким образом, можно обращаться к полям объекта, используя синтаксис массивов, что делает код более читаемым и удобным.

Важно помнить, что для `runtime` полей можно только считывать значения. Установка значений для этих полей через интерфейс `ArrayAccess` недопустима и приведет к ошибке.

```php
$author = \Bitrix\Main\Test\Typography\AuthorTable::query()
    ->registerRuntimeField(
        new \Bitrix\Main\Entity\ExpressionField('FULL_NAME', 'CONCAT(%s, " ", %s)', ['NAME', 'LAST_NAME'])
    )
    ->addSelect('ID')
    ->addSelect('FULL_NAME')
    ->where('ID', 17)
    ->fetchObject();

echo $author['FULL_NAME'];
// Аналогично вызову метода $author->get('FULL_NAME')

$author['FULL_NAME'] = 'New name';
// Вызовет исключение
```