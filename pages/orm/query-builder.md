---
title: Построитель запросов
description: 'Построитель запросов. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Методы `getList` и `getRow` сразу выполняют запрос и возвращают результат. Такой вызов подходит, когда состав полей и условия фильтрации известны заранее.

Если параметры запроса формируются программно, используйте построитель запросов — объект `Bitrix\Main\ORM\Query\Query`. Построитель накапливает параметры и выполняет запрос по вызову метода `exec`.

Сравните три способа собрать один и тот же запрос на получение книги по идентификатору. Все примеры статьи используют класс `BookTable` — его описание смотрите в статье [Операции с сущностями](./entity-operations.md).

**Метод getList**

Все параметры запроса передают одним массивом.

```php
$result = BookTable::getList([
    'select' => ['ISBN', 'TITLE', 'PUBLISH_DATE'],
    'filter' => ['=ID' => 1]
]);
```

**Объект Query**

Тот же запрос через построитель. Каждый параметр задает отдельный метод, а выполняет запрос метод `exec`.

```php
use Bitrix\Main\ORM\Query\Query;

$query = new Query(BookTable::getEntity());
$query->setSelect(['ISBN', 'TITLE', 'PUBLISH_DATE']);
$query->setFilter(['=ID' => 1]);

$result = $query->exec();
```

**Цепочка вызовов**

Тот же запрос в короткой записи. Методы построителя возвращают сам объект, поэтому вызовы можно объединить в цепочку.

```php
$query = BookTable::query()
    ->setSelect(['ISBN', 'TITLE', 'PUBLISH_DATE'])
    ->where('ID', 1)
;

$result = $query->exec();
```

Объект `Query` — основа выборки данных. Метод `getList` создает такой же объект и заполняет его переданным массивом параметров. О составе этого массива рассказывает статья [Выборка данных](./querying-data.md).

Метод `exec` возвращает объект `Bitrix\Main\ORM\Query\Result` — у него вызывают `fetch` для одной строки или `fetchAll` для всех. У построителя есть короткие псевдонимы `fetch`, `fetchAll`, `fetchObject` и `fetchCollection`: каждый выполняет запрос и сразу возвращает данные, поэтому вызывать `exec` отдельно не нужно.

{% note warning "" %}

Создавайте объект `Query` методом `query()` нужной таблицы, а не через `new Query()`. Метод `query()` возвращает класс запроса, указанный в методе `getQueryClass()` таблицы. Например, модуль информационных блоков подставляет свой класс запроса. Вызов `new Query()` всегда создает базовый класс, поэтому доработки таблицы теряются.

{% endnote %}

## Постепенное добавление параметров

Если вы не знаете заранее, какие поля выбрать или какие фильтры применить, добавляйте их в объект `Query` по ходу программы.

```php
use Bitrix\Main\ORM\Query\Query;

$query = BookTable::query();
attachSelect($query);
attachOthers($query);
$result = $query->exec();

// Функция для добавления полей в запрос
function attachSelect(Query $query): void
{
    $query->addSelect('ID');

    // Условие для добавления поля ISBN
    if (/* условие */)
    {
        $query->addSelect('ISBN');
    }
}

function attachOthers(Query $query): void
{
    // Условие для добавления фильтра
    if (/* условие */)
    {
        $query->setFilter(/* параметры фильтра */);
    }

    // Условие для добавления сортировки
    if (/* условие */)
    {
        $query->setOrder(/* параметры сортировки */);
    }
}
```

Параметры запроса разнесены по отдельным функциям, чтобы вынести логику сбора из основного кода. Метод `exec` выполнит запрос, когда обе функции добавят свои параметры.

## Запрос без выполнения

Объект `Query` позволяет построить запрос и не выполнять его. Метод `getQuery` возвращает текст запроса — он нужен для отладки или для встраивания в подзапрос.

```php
use Bitrix\Main\Type\Date;

$query = BookTable::query()
    ->setSelect(['ID'])
    ->setFilter([
        '=PUBLISH_DATE' => new Date('2014-12-13', 'Y-m-d')
    ])
;

$sql = $query->getQuery();
file_put_contents('/tmp/today_books.sql', $sql);
// в файл попадет текст SELECT ID FROM my_book WHERE PUBLISH_DATE='2014-12-13', сам запрос не выполнится
```

## Методы Query

Методы объекта `Query` задают параметры запроса. Префикс в названии показывает, что делает метод.

- `set` заменяет ранее заданное значение.

- `add` дополняет его.

- `get` возвращает текущее значение.

{% note warning "" %}

Если запрос обращается к несуществующему полю, ORM выбрасывает `Bitrix\Main\ArgumentException`. То же исключение выбрасывает `addOrder` при направлении сортировки, отличном от `ASC` и `DESC`.

{% endnote %}

### Select и Group

- `setSelect`, `setGroup` — задают список полей, полностью заменяя предыдущие.

- `addSelect`, `addGroup` — добавляют новые поля к существующему списку.

- `getSelect`, `getGroup` — возвращают массив полей.

Метод `setSelect` принимает массив, а `setGroup` и `addGroup` — строку с одним полем или массив полей. Вторым аргументом `addSelect` задают псевдоним поля: вызов `addSelect('PUBLISH_DATE', 'PUBLICATION')` вернет значение под ключом `PUBLICATION`.

В примере запрос выбирает три поля, последнее из них добавляет отдельный вызов.

```php
$books = BookTable::query()
    ->setSelect(['ID', 'TITLE'])
    ->addSelect('PUBLISH_DATE')
    ->fetchAll()
;
// SELECT ID, TITLE, PUBLISH_DATE FROM my_book
```

Чтобы посчитать книги по датам выхода, добавьте группировку. Поле `CNT` описывает объект `ExpressionField` — о таких полях рассказывает раздел [Runtime-поля](#runtime-polya).

```php
use Bitrix\Main\ORM\Fields\ExpressionField;

$stat = BookTable::query()
    ->registerRuntimeField(new ExpressionField('CNT', 'COUNT(*)'))
    ->setSelect(['PUBLISH_DATE', 'CNT'])
    ->setGroup('PUBLISH_DATE')
    ->fetchAll()
;
// SELECT PUBLISH_DATE, COUNT(*) AS CNT FROM my_book GROUP BY PUBLISH_DATE
```

### Distinct

- `setDistinct` — устанавливает флаг `DISTINCT` SQL-запроса, чтобы убрать дубликаты строк. Без аргумента ставит флаг, вызов `setDistinct(false)` его снимает.

- `hasDistinct` — возвращает `true`, если флаг `DISTINCT` установлен или указан внутри выражения `ExpressionField`, добавленного в выборку.

Чтобы получить даты выхода книг без повторов, установите флаг `DISTINCT`.

```php
$dates = BookTable::query()
    ->setSelect(['PUBLISH_DATE'])
    ->setDistinct()
    ->fetchAll()
;
// SELECT DISTINCT PUBLISH_DATE FROM my_book
```

{% note info "" %}

Метод `hasDistinct` разбирает выражения выборки, а они формируются в момент построения запроса. Вызывайте метод после `exec`, `fetchAll` или `getQuery`. У неисполненного запроса метод учитывает только флаг, заданный через `setDistinct`.

Если `DISTINCT` уже задан внутри выражения, метод снимает собственный флаг запроса, чтобы `DISTINCT` не попал в SQL дважды.

{% endnote %}

### Filter

- `setFilter` — устанавливает фильтр и заменяет предыдущий. Принимает массив условий.

- `addFilter` — добавляет одно условие к текущему фильтру. Первым аргументом принимает имя поля с префиксом оператора, вторым — значение.

- `getFilter` — возвращает текущий фильтр.

Основное условие отбирает книги с начала 2014 года, а второй вызов уточняет отбор по ISBN, если он задан.

```php
use Bitrix\Main\Type\Date;

$query = BookTable::query()->setSelect(['ID', 'TITLE']);
$query->setFilter(['>=PUBLISH_DATE' => new Date('2014-01-01', 'Y-m-d')]);

if (/* задан отбор по ISBN */)
{
    $query->addFilter('=ISBN', '978-0321127426');
}

$books = $query->fetchAll();
```

{% note tip "" %}

Метод `setFilter` принимает массив условий — тот же формат, что и ключ `filter` в методе `getList`.

Для новых запросов удобнее методы `where*`: они принимают поле, оператор и значение отдельными аргументами. Об операторах и вложенных условиях рассказывает статья [Выборка данных](./querying-data.md).

```php
use Bitrix\Main\Type\Date;

$books = BookTable::query()
    ->setSelect(['ID', 'TITLE'])
    ->where('ISBN', '978-0321127426')
    ->where('PUBLISH_DATE', '>=', new Date('2014-01-01', 'Y-m-d'))
    ->fetchAll()
;
```

{% endnote %}

### Order

- `setOrder` — задает порядок сортировки и заменяет предыдущий. Принимает массив вида `['ID' => 'DESC']` или строку с одним полем — тогда сортировка идет по возрастанию.

- `addOrder` — добавляет поле сортировки к текущему порядку. Второй аргумент по умолчанию равен `ASC`, допустимы только значения `ASC` и `DESC`.

- `getOrder` — возвращает текущий порядок сортировки.

Две сортировки работают по порядку: сначала свежие книги, внутри одной даты — по названию.

```php
$books = BookTable::query()
    ->setSelect(['ID', 'TITLE'])
    ->setOrder(['PUBLISH_DATE' => 'DESC'])
    ->addOrder('TITLE', 'ASC')
    ->fetchAll()
;
// SELECT ID, TITLE FROM my_book ORDER BY PUBLISH_DATE DESC, TITLE ASC
```

### Limit и Offset

- `setLimit`, `setOffset` — задают количество записей и смещение от начала выборки. Принимают целое число или `null`.

- `getLimit`, `getOffset` — возвращают заданные значения.

Для постраничного вывода задайте размер страницы и смещение. В примере это третья страница каталога по 20 книг.

```php
$pageSize = 20;
$page = 3;

$books = BookTable::query()
    ->setSelect(['ID', 'TITLE'])
    ->setOrder(['PUBLISH_DATE' => 'DESC'])
    ->setLimit($pageSize)
    ->setOffset(($page - 1) * $pageSize)
    ->fetchAll()
;
```

### Runtime-поля

- `registerRuntimeField` — регистрирует временное поле запроса.

Метод `registerRuntimeField` добавляет поле к таблице так же, как если бы его описали в методе `getMap`, но действует такое поле только внутри текущего запроса.

В следующем запросе поле нужно зарегистрировать заново. В метод передавайте объект поля, чаще всего `ExpressionField` — о нем рассказывает статья [Ключевые концепции ORM](./orm-concepts.md).

Здесь выражение считает возраст книги в днях — хранить это значение в таблице не нужно.

```php
use Bitrix\Main\ORM\Fields\ExpressionField;

$books = BookTable::query()
    ->registerRuntimeField(
        new ExpressionField('AGE_DAYS', 'DATEDIFF(NOW(), %s)', ['PUBLISH_DATE'])
    )
    ->setSelect(['ID', 'TITLE', 'AGE_DAYS'])
    ->fetchAll()
;
```

Пример отбирает книги старше года и выводит самые старые первыми.

```php
use Bitrix\Main\ORM\Fields\ExpressionField;

$books = BookTable::query()
    ->registerRuntimeField(
        new ExpressionField('AGE_DAYS', 'DATEDIFF(NOW(), %s)', ['PUBLISH_DATE'])
    )
    ->setSelect(['ID', 'TITLE', 'AGE_DAYS'])
    ->where('AGE_DAYS', '>', 365)
    ->setOrder(['AGE_DAYS' => 'DESC'])
    ->fetchAll()
;
```

Зарегистрированное поле доступно в выборке, фильтре и сортировке текущего запроса — регистрировать его повторно не нужно.