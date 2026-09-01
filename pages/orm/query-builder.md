---
title: Построитель запросов
description: 'Построитель запросов. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Методы выборки `getList` и `getRow` сразу выполняют запросы и возвращают результаты, поэтому они хорошо подходят для простых запросов, но когда все параметры запроса заранее неизвестны или нужна сложная логика начинаются сложности.

{% note info %}

Все примеры ниже используют условную сущность `BookTable` с полями `ID`, `TITLE`, `ISBN`, `AUTHOR_ID`, `YEAR`, `PRICE`.

{% endnote %}

Для гибкой настройки, построитель запросов использует объект `Bitrix\Main\ORM\Query\Query` - он накапливает параметры для запроса до его выполнения. 

Посмотрите, как можно выразить один и тот же запрос к `BookTable` на получение конкретной книги с использованием разных подходов:

{% list tabs %}

- Пример с getList
    
    Получение данных через getList

    ```php
    $result = BookTable::getList([
        'select' => ['ISBN', 'TITLE', 'PUBLISH_DATE'],
        'filter' => ['=ID' => 1]
    ]);
    ```

- С использованием Query

    ```php
    use Bitrix\Main\ORM\Query\Query;

    $q = new Query(BookTable::getEntity());
    $q->setSelect(['ISBN', 'TITLE', 'PUBLISH_DATE']);
    $q->setFilter(['=ID' => 1]);

    $result = $q->exec();
    ```

- С использованием текучего синтаксиса
    ```php
    $q = BookTable::query()
        ->setSelect(['ISBN', 'TITLE', 'PUBLISH_DATE'])
        ->where('ID', 1)
    ;

    $result = $q->exec();
    ```

{% endlist %}

Объект `Query` — ключевой элемент для выборки данных. Именно он используется внутри `getList`/`getRow`.

{% note warning %}

В современном Bitrix Framework рекомендуется получать объект `Query` через статический метод `::query()` [соответствующей DataManager таблицы](*recomend_query), поскольку `Query` - это общий класс запроса и каждый DataManager-наследник вправе расширять его для своих технических нужд.

{% endnote %}

## Постепенное добавление параметров

Если вы не знаете заранее, какие поля выбрать или какие фильтры применить, используйте объект `Query` для постепенного добавления параметров.

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

**Создание объекта Query**. Используем `BookTable::query()` для создания нового объекта `Query`, связанного с сущностью `BookTable`. Это будет основой для построения запроса.

**Добавление полей в запрос**. Функция `attachSelect` добавляет поля, которые нужно выбрать из базы данных.

-  `addSelect('ID')` добавляет поле `ID` в список выбираемых полей

-  Условие внутри функции добавляет поле `ISBN`, если оно необходимо

**Добавление фильтров и сортировки**. Функция `attachOthers` добавляет фильтры и сортировку.

-  `setFilter` устанавливает условия фильтрации данных

-  `setOrder` задает порядок сортировки результатов

## Запрос без выполнения

Объект `Query` позволяет строить запрос без его выполнения. Это полезно для подзапросов или получения текста запроса:

```php
use Bitrix\Main\Type\Date;

$q = BookTable::query()
    ->setSelect(['ID'])
    ->setFilter([
        '=PUBLISH_DATE' => new Date('2014-12-13', 'Y-m-d')
    ])
;

$sql = $q->getQuery();
file_put_contents('/tmp/today_books.sql', $sql);
// Запрос "SELECT ID FROM b_book WHERE PUBLISH_DATE='2014-12-13'" будет сохранен в файл, но не выполнен.
```

## Методы Query

В данном разделе собраны примеры использования методов `Query`.

### select, group

- `setSelect`, `setGroup` — задаёт список полей, полностью заменяя предыдущие.
- `addSelect`, `addGroup` — добавляет новые поля к существующему списку.
- `getSelect`, `getGroup` — возвращает массив полей.

```php
$query = BookTable::query();

$query->setSelect(['ID', 'TITLE']); // список полей: ID, TITLE
$query->addSelect('PRICE');         // добавили PRICE к списку

print_r($query->getSelect());
// ['ID', 'TITLE', 'PRICE']

$query->setSelect(['ID', 'ISBN']);  // предыдущий список заменён
print_r($query->getSelect());
// ['ID', 'ISBN']
```

```php
$query = BookTable::query()
    ->setSelect(['AUTHOR_ID', 'YEAR'])
;

$query->setGroup('AUTHOR_ID'); // принимает строку или массив
$query->addGroup('YEAR');      // добавили YEAR к AUTHOR_ID

print_r($query->getGroup());
// ['AUTHOR_ID', 'YEAR']
```

### distinct

- `setDistinct` — устанавливает флаг `DISTINCT`, чтобы убрать дубликаты строк из результата.
- `hasDistinct` — возвращает `true`, если флаг `DISTINCT` установлен или указан внутри выражения `ExpressionField`, добавленного в выборку.

```php
// Получить уникальных авторов книг
$query = BookTable::query()
    ->setSelect(['AUTHOR_ID'])
    ->setDistinct()
;

$books = $query->fetchAll();
// SQL: SELECT DISTINCT AUTHOR_ID FROM b_book

if ($query->hasDistinct()) {
    // ...
}
```

```php
use Bitrix\Main\ORM\Fields\ExpressionField;

// DISTINCT внутри выражения тоже делает выборку уникальной
$query = BookTable::query()
    ->registerRuntimeField(
        new ExpressionField('AUTHORS_CNT', 'COUNT(DISTINCT %s)', ['AUTHOR_ID'])
    )
    ->setSelect(['AUTHORS_CNT']);

$query->hasDistinct(); // true, хотя setDistinct() не вызывали
```

### filter

- `setFilter` — устанавливает фильтр.
- `addFilter` — добавляет параметр фильтра.
- `getFilter` — возвращает фильтр.

```php
$query = BookTable::query();

$query->setFilter(['>=PRICE' => 500]);   // цена от 500
$query->addFilter('AUTHOR_ID', 10);      // добавили условие по автору

print_r($query->getFilter());
// ['>=PRICE' => 500, 'AUTHOR_ID' => 10]
```

`setFilter` заменяет фильтр целиком, так же как и `setSelect` заменяет список полей.


{% note note %}

Методы `setFilter` / `addFilter` работают со старым массивом фильтра. Для нового кода предпочтительны fluent-условия `where*()` и `Query::filter()`:

```php
$books = BookTable::query()
    ->setSelect(['ID', 'TITLE'])
    ->where('AUTHOR_ID', 10)
    ->where('PRICE', '>=', 500)
    ->fetchAll()
;
```

{% endnote %}


### order

- `setOrder` — устанавливает порядок сортировки.
- `addOrder` — добавляет поле для сортировки.
- `getOrder` — возвращает порядок сортировки.

```php
$query = BookTable::query();

$query->setOrder(['TITLE' => 'ASC']); // сначала по названию
$query->addOrder('YEAR', 'DESC');     // затем свежие издания раньше

print_r($query->getOrder());
// ['TITLE' => 'ASC', 'YEAR' => 'DESC']
```

### limit/offset

- `setLimit`, `setOffset` — устанавливают значение.
- `getLimit`, `getOffset` — возвращают значение.

```php
// Третья страница каталога: по 20 книг на страницу
$query = BookTable::query()
    ->setSelect(['ID', 'TITLE'])
    ->setLimit(20)
    ->setOffset(40); // пропустить первые 40 записей

$query->getLimit();  // 20
$query->getOffset(); // 40
```

### runtime fields

- `registerRuntimeField` — регистрирует временное поле.

Временное поле существует только внутри запроса: его вычисляет SQL, а в карту сущности оно не добавляется. В `registerRuntimeField` передавайте объект поля, например `ExpressionField`:

```php
use Bitrix\Main\ORM\Fields\ExpressionField;

$books = BookTable::query()
    ->registerRuntimeField(
        new ExpressionField('PRICE_WITH_VAT', '%s * 1.2', ['PRICE'])
    )
    ->setSelect(['ID', 'TITLE', 'PRICE_WITH_VAT'])
    ->fetchAll()
;
```

Runtime-поля можно использовать и в фильтре, и в сортировке:

```php
use Bitrix\Main\ORM\Fields\ExpressionField;

$books = BookTable::query()
    ->registerRuntimeField(
        new ExpressionField('PRICE_WITH_VAT', '%s * 1.2', ['PRICE'])
    )
    ->setSelect(['ID', 'TITLE', 'PRICE_WITH_VAT'])
    ->where('PRICE_WITH_VAT', '>', 1000)
    ->setOrder(['PRICE_WITH_VAT' => 'DESC'])
    ->fetchAll()
;
```

[*recomend_query]: посмотрите на `BookTable::query()` на вкладке "С использованием текучего синтаксиса"