---
title: Выборка данных
description: 'Выборка данных в ORM Bitrix Framework: параметры getList, операторы фильтра, кеширование выборки, короткие вызовы getById и getRow, области данных setDefaultScope и with*, QueryHelper::decompose для связей 1:N и N:M, методы where* и ConditionTree.'
---

Для выборки данных с фильтрацией, группировкой и сортировкой в Bitrix Framework используются метод `getList` и [построитель запросов](./query-builder.md) на объекте [`Bitrix\Main\ORM\Query\Query`](../api-reference/main/orm/query/query/index.md).

Какой способ выбрать:

| Задача | Способ |
|---|---|
| Запрос с известным набором условий, сортировкой и постраничной навигацией | Метод [getList](#getlist) с массивом параметров |
| Одна запись по первичному ключу или по условию | [Короткие вызовы](#short-calls) `getById`, `getRowById`, `getRow` |
| Условия собираются в коде по шагам, нужны `OR` и вложенные группы | Методы `where*` объекта `Query` — раздел [Фильтр ORM](#orm-filter) |
| Повторяющиеся условия нужны во многих запросах | [Предустановленные выборки](#scopes) `setDefaultScope` и `with*` |
| Выборка связей 1:N и N:M с `LIMIT` | [QueryHelper::decompose](#decompose) |

## Метод getList {#getlist}

Метод `getList` есть у каждого ORM-класса, унаследованного от [`Bitrix\Main\ORM\Data\DataManager`](../api-reference/main/orm/data/data-manager/index.md), и принимает одинаковый набор параметров. Внутри метод создает объект [`Query`](../api-reference/main/orm/query/query/index.md), поэтому все возможности `getList` доступны и в [построителе запросов](./query-builder.md).

Примеры статьи используют сущности модуля `somepartner.mybookscatalog`. Полное описание класса `BookTable` смотрите в статье [Концепция ORM](./orm-concepts.md#book-model). Перед обращением к классу подключите модуль вызовом `Loader::includeModule('somepartner.mybookscatalog')` — подробнее в разделе [Подключить модуль сущности](./orm-concepts.md#include-module). Чтобы не повторять служебные строки, фрагменты ниже опускают подключение модуля и импорт класса:

```php
use Bitrix\Main\Loader;
use SomePartner\MyBooksCatalog\BookTable;

Loader::includeModule('somepartner.mybookscatalog');
```

Рассмотрим применение метода на примере сущности `BookTable`. Пример считает, сколько книг выпущено в каждую дату:

```php
use Bitrix\Main\ORM;
use Bitrix\Main\Type\Date;

$result = BookTable::getList([
    'select' => ['PUBLISH_DATE', 'CNT'], // поля, которые нужно получить
    'filter' => ['>=PUBLISH_DATE' => new Date('2020-01-01', 'Y-m-d')], // условия фильтрации
    'group' => ['PUBLISH_DATE'], // поля для группировки
    'order' => ['PUBLISH_DATE' => 'DESC'], // параметры сортировки
    'limit' => 10, // количество записей
    'offset' => 0, // смещение для limit
    'runtime' => [ // поля, которые существуют только в этом запросе
        new ORM\Fields\ExpressionField('CNT', 'COUNT(*)'),
    ],
    'count_total' => true, // подсчитать общее количество записей для getCount()
]);
```

Все параметры необязательны. Вызов `BookTable::getList()` без параметров выбирает все скалярные поля всех записей.

| Ключ | Тип | По умолчанию | Назначение |
|---|---|---|---|
| `select` | `array` | `['*']` | Поля для выборки, алиасы в виде `'АЛИАС' => 'ПОЛЕ'` |
| `filter` | `array` или [`ConditionTree`](../api-reference/main/orm/query/filter/condition-tree/index.md) | без условий | Условия `WHERE` и `HAVING`: массив с [операторами](#operators) или объект [фильтра ORM](#orm-filter) |
| `group` | `array` | без группировки | Поля для `GROUP BY` |
| `order` | `array` или `string` | без сортировки | Поля и направление `ASC` или `DESC` в любом регистре. Другое направление вызывает `ArgumentException` с текстом `Invalid order` |
| `limit` | `int` | без ограничения | Максимальное количество записей |
| `offset` | `int` | `0` | Смещение для `limit` |
| `runtime` | `array` | нет | Объекты полей, которые добавляются к сущности только на время запроса |
| `count_total` | `bool` | `false` | Посчитать количество записей без учета `limit` и `offset` для `getCount()` |
| `cache` | `array` | без кеша | Ключи `ttl` — время жизни кеша в секундах, `cache_joins` — кешировать запросы с `JOIN` |
| `data_doubling` | `bool` | `true` | `false` — условия фильтра по полям связей 1:N превращаются в подзапрос `ID IN (SELECT …)`, поэтому основные записи не дублируются из-за фильтра. Для связи N:M такой запрос завершается SQL-ошибкой `Unknown column`. На связи в `select` не влияет, для них используйте [QueryHelper::decompose](#decompose). Работает только для сущностей с одним первичным полем |
| `private_fields` | `bool` | `false` | Разрешить в запросе поля, отмеченные `configurePrivate()`. Без параметра — `SystemException`. В `filter` приватные поля запрещены и с параметром |

{% note warning "" %}

Неизвестный ключ в массиве параметров вызывает исключение `Bitrix\Main\ArgumentException` с текстом `Unknown parameter: <ключ>`. Опечатка в имени ключа не игнорируется.

{% endnote %}

### Получение данных из результата

Метод `getList` возвращает объект [`Bitrix\Main\ORM\Query\Result`](../api-reference/main/orm/query/result/index.md) — наследник [`Bitrix\Main\DB\Result`](../api-reference/main/db/result/index.md). Основные методы результата:

| Метод | Что возвращает |
|---|---|
| `fetch()` | Следующую запись в виде массива или `false`, если записи закончились |
| `fetchAll()` | Все записи в виде массива массивов |
| `fetchObject()` | Следующую запись в виде [объекта ORM](./objects.md) или `null`, если записи закончились. Для запроса с группировкой — исключение `SystemException`, используйте `fetch()` |
| `fetchCollection()` | Все записи в виде [коллекции объектов](./collections.md). Для запроса с группировкой — исключение `SystemException`, используйте `fetchAll()` |
| `getCount()` | Количество записей без учета `limit` и `offset`. Работает только с параметром `count_total`, без него — исключение `ObjectPropertyException` |

```php
$parameters = [
    'select' => ['ID', 'TITLE'],
    'order' => ['ID' => 'ASC'],
];

// Получение данных построчно
$rows = [];
$result = BookTable::getList($parameters);
while ($row = $result->fetch())
{
    $rows[] = $row;
}

// Получение всех данных сразу
$rows = BookTable::getList($parameters)->fetchAll();
```

### Форматирование данных

Метод `addFetchDataModifier()` объекта поля добавляет модификатор чтения. Модификатор получает значение поля после преобразования типов и возвращает новое значение. Модификатор добавляют полю в `getMap()`, поэтому он действует во всех запросах сущности, которые выбирают это поле. Модификатор меняет значение в массивах, которые возвращают `fetch()` и `fetchAll()`, для всего кода, который читает сущность. Объект ORM из `fetchObject()` хранит значение в типе поля. Для разового форматирования форматируйте значение после `fetch()`.

**Пример.** Поле `PUBLISH_DATE` отдается строкой в формате дня, месяца и года:

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\DateField;

class BookTable extends DataManager
{
    public static function getMap(): array
    {
        return [
            // остальные поля — как в статье «Концепция ORM»
            (new DateField('PUBLISH_DATE'))
                ->addFetchDataModifier(static function ($value)
                {
                    return $value === null ? null : $value->format('d.m.Y');
                }),
        ];
    }
}

// Использование
$rows = BookTable::getList([
    'select' => ['ID', 'PUBLISH_DATE'],
])->fetchAll();
// $rows[0]['PUBLISH_DATE'] — строка вида '15.03.2020'
```

В старом коде тот же модификатор задают параметром `fetch_data_modification` в массиве конструктора поля. Параметр принимает функцию, которая возвращает массив модификаторов. Массив параметров конструктора остался для совместимости, в новом коде используйте `addFetchDataModifier()`.

### Параметры метода getList

#### Select

Параметр `select` задается как массив с именами полей сущности.

```php
BookTable::getList([
    'select' => ['ISBN', 'TITLE', 'PUBLISH_DATE']
]);
// SELECT ISBNCODE AS ISBN, TITLE, PUBLISH_DATE FROM my_book
```

Чтобы изменить названия полей, используйте алиасы. Алиасы позволяют переименовывать поля в результирующем наборе данных для удобства. Например, чтобы поле `PUBLISH_DATE` отображалось как `PUBLICATION`:

```php
BookTable::getList([
    'select' => ['ISBN', 'TITLE', 'PUBLICATION' => 'PUBLISH_DATE']
]);
// SELECT ISBNCODE AS ISBN, TITLE, PUBLISH_DATE AS PUBLICATION FROM my_book
```

Алиас не должен совпадать с именем существующего поля сущности: например, `'TITLE' => 'ISBN'` вызовет `ArgumentException` с текстом `Alias "TITLE" matches already existing field`.

Для выбора всех полей используйте символ `*`.

```php
BookTable::getList([
    'select' => ['*']
]);
```

При этом выберутся только скалярные поля `ScalarField`. Скалярные поля — это обычные поля таблицы. Вычисляемые поля [`ExpressionField`](../api-reference/main/orm/fields/expression-field/index.md) и связи с другими сущностями нужно указывать в запросе. Они создаются на основе выражений и не являются частью таблицы по умолчанию.

Символ `*` работает и для связанной сущности: `'PUBLISHER.*'` выбирает все скалярные поля издательства.

#### Filter

Параметр `filter` задает условия для выборки данных в виде ассоциативного массива. Ключи массива это условия, а значения — параметры для поиска.

```php
// WHERE ID = 1
BookTable::getList([
    'filter' => ['=ID' => 1]
]);

// WHERE TITLE LIKE 'Patterns%'
BookTable::getList([
    'filter' => ['%=TITLE' => 'Patterns%']
]);
```

Фильтр может быть многоуровневым с использованием `AND` или `OR`, что позволяет комбинировать условия. Логику группы задает ключ `LOGIC` со значением `'OR'` или `'AND'` строго в верхнем регистре: в корне фильтра значение `'or'` в нижнем регистре молча отбрасывает все условия, и запрос выбирает все записи, во вложенной группе — превращается в `AND`.

```php
// WHERE ID = 1 AND ISBN = '9780321127426'
BookTable::getList([
    'filter' => [
        '=ID' => 1,
        '=ISBN' => '9780321127426'
    ]
]);

// WHERE (ID=1 AND ISBN='9780321127426') OR (ID=2 AND ISBN='9781449314286')
BookTable::getList([
    'filter' => [
        'LOGIC' => 'OR',
        [
            '=ID' => 1,
            '=ISBN' => '9780321127426'
        ],
        [
            '=ID' => 2,
            '=ISBN' => '9781449314286'
        ]
    ]
]);
```

##### Операторы сравнения {#operators}

Оператор записывают префиксом перед именем поля в ключе массива: `'>=PUBLISH_DATE'`, `'!@ID'`.

| Префикс | SQL | Значение условия |
|---|---|---|
| `=` | `=` или `IN` | Значение или массив значений |
| `!=` | `<>` или `NOT IN` | Значение или массив значений |
| `>`, `<`, `>=`, `<=` | `>`, `<`, `>=`, `<=` | Значение |
| `><` | `BETWEEN` | Массив `[MIN, MAX]` |
| `!><` | `NOT BETWEEN` | Массив `[MIN, MAX]` |
| `@` | `IN` | Массив или объект [`Bitrix\Main\DB\SqlExpression`](../api-reference/main/db/sql-expression/index.md) |
| `!@` | `NOT IN` | Массив или объект `Bitrix\Main\DB\SqlExpression` |
| `%` | `LIKE '%значение%'` | Подстрока. Символы `%` добавляются автоматически, сравнение без учета регистра. Для целочисленных полей — `=` |
| `!%` | `NOT LIKE '%значение%'` | Подстрока |
| `=%` или `%=` | `LIKE` | Шаблон: положение символов `%` задается в значении. Без приведения к верхнему регистру, регистрозависимость определяет сопоставление колонки |
| `!=%` или `!%=` | `NOT LIKE` | Шаблон |
| `==` | `IS NULL`, булево выражение или строгое `=` | `null` — `IS NULL`. `true` или `false` — булево выражение `ExpressionField`, например `EXISTS()`. Другое значение — строгое `=` только для целочисленных полей, для остальных типов условие отбрасывается |
| `!==` | `IS NOT NULL` или отрицание булева выражения | `null` — `IS NOT NULL`. `true` или `false` — отрицание булева выражения. Другое значение условие не создает |
| `!` | `NOT LIKE` для строковых полей, `<>` для числовых | Значение |
| `?` | логическое выражение поиска | Строка поиска, которую разбирает функция `GetFilterQuery`. Только для строковых полей, для других типов условие отбрасывается |
| `*`, `*=`, `*%` | полнотекстовый поиск | Строка поиска. Только для строковых полей, для других типов условие отбрасывается |

Варианты шаблона для `'%=TITLE'`, запись `'=%TITLE'` работает так же:

-  `'%=TITLE' => 'Patterns'` — точное значение без символов `%`,

-  `'%=TITLE' => 'Patterns%'` — значение начинается с `Patterns`,

-  `'%=TITLE' => '%Patterns'` — значение заканчивается на `Patterns`,

-  `'%=TITLE' => '%Patterns%'` — значение содержит `Patterns`.

Последний вариант отличается от `'%TITLE' => 'Patterns'` тем, что шаблон `LIKE` задается явно в значении условия.

Проверка на `NULL`: `'==ID' => null` дает `ID IS NULL`, `'!==TITLE' => null` — `TITLE IS NOT NULL`.

##### Условие без префикса и особые значения

В массиве `filter` условие без префикса выбирает оператор по типу поля и значению:

| Поле и значение | Условие | Результат |
|---|---|---|
| Строковое поле, непустая строка | `'TITLE' => 'Patterns%'` | `LIKE 'Patterns%'` без учета регистра, символы `%` не добавляются |
| Строковое поле, пустая строка | `'TITLE' => ''` или `'=TITLE' => ''` | `(TITLE IS NULL OR TITLE = '')` |
| Строковое поле, строка из цифр | `'ISBN' => '123'` | `= '123'` |
| Строковое поле, массив строк | `'TITLE' => ['A%', 'B%']` | несколько `LIKE`, объединенных через `OR` |
| Целочисленное поле, ненулевое значение | `'ID' => 5` | `ID = 5` |
| Целочисленное поле, массив | `'ID' => [1, 2, 3]` | `ID IN (1, 2, 3)` |
| Целочисленное поле, `0` | `'ID' => 0` или `'=ID' => 0` | `(ID IS NULL OR ID = 0)` |
| Целочисленное поле, `0` с отрицанием | `'!ID' => 0` или `'!=ID' => 0` | `(ID IS NOT NULL AND ID <> 0)` |
| Строгое сравнение с нулем | `'==ID' => 0` | `ID = 0` |

Метод `where('FIELD', $value)` без отдельного оператора всегда использует `=`.

{% note warning "" %}

Пустые массивы и границы диапазона обрабатываются по-разному:

-  `'=ID' => []` для целочисленного поля дает условие `1=0` — пустую выборку,

-  `'@ID' => []` дает `ID IN ()` — ошибку SQL. Проверяйте массив на пустоту до запроса,

-  `'><ID' => [5]` — массив меньше чем из двух элементов — условие молча отбрасывается,

-  `whereIn('ID', [])` в фильтре ORM не добавляет условие, и запрос выбирает все записи,

-  `'==FIELD' => 'значение'` для нецелочисленного поля и `'!==FIELD' => 'значение'` для поля любого типа молча отбрасываются — используйте `=` и `!=`,

-  `'!=ID' => []` для целочисленного поля дает `1=1` — выборку всех записей,

-  `'!=TITLE' => 'x'` для строкового поля дает `(TITLE IS NULL OR TITLE <> 'x')`: записи с `NULL` попадают в выборку,

-  даты для полей `DateField` и `DatetimeField` передавайте объектами [`Bitrix\Main\Type\Date`](../api-reference/main/type/date/index.md) и [`Bitrix\Main\Type\DateTime`](../api-reference/main/type/date-time/index.md). Строка разбирается в формате даты текущего сайта,

-  `'%TITLE' => ''` дает `(TITLE IS NULL OR TITLE = '')`, а не все записи. Не добавляйте условие, если строка поиска пуста.

{% endnote %}

{% note warning "" %}

Не подставляйте в `filter` ключи из пользовательского ввода: префиксы операторов, например `?` или `*`, меняют логику условия. Сверяйте поля и операторы с белым списком — подробнее в статье [SQL-инъекции](./../security/sql-injection.md).

{% endnote %}

#### Group

Параметр `group` задает поля для группировки. Это позволяет объединять записи с одинаковыми значениями в указанных полях:

```php
BookTable::getList([
    'group' => ['PUBLISH_DATE']
]);
```

Если в `select` есть агрегатное выражение, например `COUNT(*)`, ORM добавляет `GROUP BY` по остальным полям `select` и `order` автоматически, как в [примере с runtime-полем](#runtime). Явный `group` нужен, когда группировка должна отличаться от полей выборки.

#### Order

Параметр `order` задает порядок сортировки.

```php
BookTable::getList([
    'order' => ['PUBLISH_DATE' => 'DESC', 'TITLE' => 'ASC']
]);

BookTable::getList([
    'order' => ['ID'] // направление по умолчанию — ASC
]);
```

-  `ASC` — по возрастанию

-  `DESC` — по убыванию

#### Limit и Offset

Параметры `limit` и `offset` ограничивают количество записей и создают постраничную выборку.

```php
// 10 последних записей
BookTable::getList([
    'order' => ['ID' => 'DESC'],
    'limit' => 10
]);

// Получить записи для пятой страницы, если на каждой странице отображается по 20 записей
BookTable::getList([
    'order' => ['ID'],
    'limit' => 20,
    'offset' => 80
]);
```

#### Runtime {#runtime}

Параметр `runtime` добавляет временные поля, которые вычисляются во время выполнения запроса.

##### Подсчет записей

Для подсчета количества записей используйте `ExpressionField`:

```php
use Bitrix\Main\ORM;

BookTable::getList([
    'select' => ['CNT'],
    'runtime' => [
        new ORM\Fields\ExpressionField('CNT', 'COUNT(*)')
    ]
]);
// посчитать общее количество записей в таблице
// SELECT COUNT(*) AS CNT FROM my_book
```

Здесь вычисляемое поле реализует SQL-выражение с функцией `COUNT`.

##### Вычисляемое поле в фильтре

После того, как добавили вычисляемое поле, его можно использовать в фильтрах:

```php
use Bitrix\Main\ORM;

BookTable::getList([
    'select' => ['PUBLISH_DATE'],
    'filter' => ['>CNT' => 5],
    'runtime' => [
        new ORM\Fields\ExpressionField('CNT', 'COUNT(*)')
    ]
]);
// посчитать общее количество записей в таблице
// выбрать те дни, когда выпущено более 5 книг
// SELECT PUBLISH_DATE, COUNT(*) AS CNT FROM my_book GROUP BY PUBLISH_DATE HAVING COUNT(*) > 5
```

Система автоматически группирует по `PUBLISH_DATE`.

##### Другие типы полей в runtime

В `runtime` можно регистрировать не только `Expression` поля, но и другие типы. Механизм `runtime` добавляет поле к сущности, как если бы оно было описано в `getMap`. Однако такое поле доступно только в рамках одного запроса и требует повторной регистрации в следующем вызове `getList`.

**Пример.** Временная связь `PUBLISHER_REF` с издательством и фильтр по его названию:

```php
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;
use SomePartner\MyBooksCatalog\PublisherTable;

BookTable::getList([
    'select' => ['TITLE', 'PUBLISHER_TITLE' => 'PUBLISHER_REF.TITLE'],
    'filter' => ['=PUBLISHER_REF.TITLE' => 'Example Press'],
    'runtime' => [
        new Reference('PUBLISHER_REF', PublisherTable::class, Join::on('this.PUBLISHER_ID', 'ref.ID')),
    ],
]);
```

Ключ массива `runtime` можно не указывать, если передан объект поля с именем: имя берется из объекта.

##### Вычисляемые поля без runtime

Если вычисляемое поле нужно только в `select`, `runtime` можно не использовать. Система поддерживает вложенные выражения, которые разворачиваются в финальном SQL.

```php
use Bitrix\Main\ORM;

BookTable::getList([
    'select' => [
        new ORM\Fields\ExpressionField('MAX_AGE', 'MAX(%s)', ['AGE_DAYS'])
    ]
]);
// SELECT MAX(DATEDIFF(NOW(), PUBLISH_DATE)) AS MAX_AGE FROM my_book
```

-  Создается вычисляемое поле `MAX_AGE` через `ExpressionField`

-  Используется вложенное выражение `MAX(%s)`, где `%s` заменяется на `AGE_DAYS`

-  `AGE_DAYS` — вычисляемое поле из `getMap` класса [BookTable](./orm-concepts.md#book-model), оно автоматически разворачивается в `DATEDIFF(NOW(), PUBLISH_DATE)`

Вложенные выражения разворачиваются последовательно.

{% note warning "" %}

Функция `DATEDIFF()` есть только в MySQL. ORM подставляет текст выражения в SQL без изменений, поэтому на PostgreSQL такой запрос завершится ошибкой. Если модуль должен работать с обеими СУБД, замените функции MySQL по правилам из статьи [Как писать код, совместимый с PostgreSQL](./../database/postgresql/compatible-code.md). Класс [SqlHelper](./../database/sql-helper-and-expression.md) возвращает функции текущей даты и арифметику дат для текущей СУБД.

{% endnote %}

#### Count_total

Чтобы узнать общее количество записей, которые соответствуют запросу, передайте параметр `count_total` со значением `true`. Метод `getCount()` возвращает количество без учета `limit` и `offset`. Сами ограничения продолжают действовать при получении данных.

**Пример.** Запрос выбирает до десяти книг и подсчитывает общее количество книг для постраничного вывода:

```php
$result = BookTable::getList([
    'select' => ['ID', 'TITLE'],
    'order' => ['ID' => 'ASC'],
    'limit' => 10,
    'offset' => 0,
    'count_total' => true
]);

$total = $result->getCount(); // общее количество записей
$rows = $result->fetchAll(); // не более десяти записей
```

Для подсчета ORM при необходимости выполняет дополнительный запрос. Если вызвать `getCount()` без `'count_total' => true`, метод выбросит исключение `Bitrix\Main\ObjectPropertyException`.

### Кеширование выборки

Кеширование выборки позволяет сохранять результаты запросов для повторного использования. По умолчанию кеширование отключено.

Для включения кеширования используйте ключ `cache` в методе `getList`:

```php
$res = \Bitrix\Main\GroupTable::getList([
    'filter' => ['=ID' => 1],
    'cache' => ['ttl' => 3600] // Время жизни кеша в секундах
]);
```

С объектом `Query` время жизни кеша задает метод `setCacheTtl()`:

```php
$query = \Bitrix\Main\GroupTable::query();
$query->setSelect(['*']);
$query->setFilter(['=ID' => 1]);
$query->setCacheTtl(150);
$res = $query->exec();
```

#### Особенности кеширования

-  Если данные найдены в кеше, `getList` и `exec()` по-прежнему возвращают объект `Bitrix\Main\ORM\Query\Result`, но строки читаются из кеша, а не из базы данных.

-  По умолчанию выборки с `JOIN` не кешируются. Чтобы включить кеширование с `JOIN`, используйте ключ `cache_joins`. Изменение присоединенной сущности не сбрасывает такой кеш: вызовите `cleanCache()` основной сущности вручную или задайте короткий `ttl`.

```php
$res = \Bitrix\Main\GroupTable::getList([
    'cache' => ['ttl' => 3600, 'cache_joins' => true]
]);

// или
$query = \Bitrix\Main\GroupTable::query();
$query->cacheJoins(true);
```

#### Сброс кеша

Кеш автоматически сбрасывают только ORM-методы `add`, `addMulti`, `update`, `updateMulti`, `delete` этой сущности. После изменения таблицы прямым SQL-запросом или через классический API вызовите `cleanCache()`. Если ORM-класс переопределяет метод `isCacheable()` и возвращает `false`, кеширование выборок сущности отключено.

```php
/* Пример для таблицы пользователей */
\Bitrix\Main\UserTable::getEntity()->cleanCache();
```

#### Ограничение времени жизни кеша

Администратор проекта может ограничить время жизни кеша для таблицы сущности в секции `cache_flags` файла `/bitrix/.settings.php`:

-  `<таблица>_min_ttl` — минимальное время жизни кеша в секундах,

-  `<таблица>_max_ttl` — максимальное время жизни кеша в секундах,

-  `<таблица>_max_ttl` = `0` — кеширование выборок таблицы отключено, даже если в запросе передан `ttl`.

Вместо `<таблица>` подставляют имя, которое возвращает метод `getTableName()` ORM-класса:

```php
// фрагмент /bitrix/.settings.php
'cache_flags' => [
    'value' => [
        'config_options' => 3600,
        'my_book_max_ttl' => 600, // кеш выборок BookTable не дольше 10 минут
    ],
    'readonly' => false,
],
```

Подробнее о секции — в статье [Конфигурация ядра](./../framework/settings.md), об общем механизме кеша — в статье [Кеширование](./../performance/caching.md).

## Короткие вызовы {#short-calls}

Для упрощения работы с данными, помимо метода `getList`, доступны более короткие методы:

-  `getById($id)` — выборка по первичному ключу, возвращает объект `Result`.

-  `getByPrimary($primary, array $parameters = [])` — выборка по первичному ключу с дополнительными параметрами `getList`, возвращает объект `Result`.

В обоих методах первичный ключ можно передавать как число или массив. Массив используется, если есть несколько первичных полей. Ключ `filter` в `$parameters` метода `getByPrimary` добавляется к условию по первичному ключу через `AND`.

Неверный первичный ключ вызывает исключение `Bitrix\Main\ArgumentException`:

-  `Unknown primary` — элемент массива не является первичным ключом,

-  `Require multi primary` — передано одно значение, а первичный ключ составной,

-  `Empty primary` — передан пустой массив.

```php
BookTable::getById(1);
BookTable::getByPrimary(['ID' => 1]);

// Эти вызовы аналогичны следующему вызову getList:
BookTable::getList([
    'filter' => ['=ID' => 1]
]);
```

-  `getRowById($id, array $parameters = [])` — выборка по первичному ключу, возвращает массив данных записи или `null`, если запись не найдена.

```php
$row = BookTable::getRowById($id);
// Аналогичный результат можно получить так:
$result = BookTable::getById($id);
$row = $result->fetch();
// Или так:
$result = BookTable::getList([
    'filter' => ['=ID' => $id]
]);
$row = $result->fetch();
```

-  `getRow(array $parameters)` — выборка по параметрам `getList`, возвращает первую запись в виде массива или `null`, если записей нет. Метод сам задает `limit` = `1`.

```php
$row = BookTable::getRow([
    'filter' => ['%=TITLE' => 'Patterns%'],
    'order' => ['ID']
]);

// Аналогичный результат можно получить так:
$result = BookTable::getList([
    'filter' => ['%=TITLE' => 'Patterns%'],
    'order' => ['ID'],
    'limit' => 1
]);
$row = $result->fetch();
```

-  `getCount($filter = [], array $cache = [])` — количество записей по фильтру: массив или объект [`ConditionTree`](../api-reference/main/orm/query/filter/condition-tree/index.md). Возвращает `int`. Не путайте с методом результата `getCount()`, который работает только с `count_total`.

```php
$count = BookTable::getCount(['=PUBLISHER_ID' => 1]); // int
```

## Предустановленные выборки {#scopes}

Предустановленные выборки позволяют заранее задавать параметры для выборки данных: фильтры, сортировки или выбор полей. Их можно разделить на два уровня:

1. Глобальная область данных — настройки применяются ко всем запросам, связанным с определенной сущностью.

2. Локальная область данных — настройки применяются только к конкретному запросу и могут быть изменены.

### Глобальная область данных

Одну таблицу можно описать несколькими сущностями, разделив записи на сегменты. ORM вызывает метод `setDefaultScope` при построении каждого запроса сущности. Метод получает объект [`Query`](../api-reference/main/orm/query/query/index.md) и добавляет в него фильтры и другие параметры.

**Пример.** Два класса делят элементы инфоблоков по `IBLOCK_ID`. Перед использованием подключите модуль: `Loader::includeModule('iblock')`.

```php
use Bitrix\Iblock\ElementTable;
use Bitrix\Main\ORM\Query\Query;

class Element4Table extends ElementTable
{
    /**
     * @param Query $query
     */
    public static function setDefaultScope($query)
    {
        return $query->where('IBLOCK_ID', 4);
    }
}

class Element5Table extends ElementTable
{
    /**
     * @param Query $query
     */
    public static function setDefaultScope($query)
    {
        return $query->where('IBLOCK_ID', 5);
    }
}
```

1. Оба класса наследуют `getTableName()` и `getMap()` от `Bitrix\Iblock\ElementTable`, поэтому работают с одной таблицей элементов инфоблоков.

2. `setDefaultScope` определяет дополнительные условия для каждого запроса:

   -  в классе `Element4Table` фильтруются записи с `IBLOCK_ID = 4`,

   -  в классе `Element5Table` фильтруются записи с `IBLOCK_ID = 5`.

Сигнатура метода должна совпадать с родительской `DataManager::setDefaultScope($query)`: тип параметра в объявлении не указывают, его задают в PHPDoc. Объявление `setDefaultScope(Query $query)` вызовет фатальную ошибку несовместимой сигнатуры.

Хотя обе сущности работают с одной таблицей, они оперируют разными наборами данных благодаря настроенным фильтрам.

### Локальная область данных

Локальную предустановленную выборку описывают статическим методом `with*` в ORM-классе и вызывают на объекте `Query` без префикса класса: метод `BookTable::withPublishedAfter()` вызывается как `->withPublishedAfter()`. ORM передает в метод объект `Bitrix\Main\ORM\Query\Query` первым аргументом, остальные аргументы вызова — следом. Если метода с таким именем в классе нет, ORM выбрасывает исключение `Bitrix\Main\SystemException` с текстом `Unknown method`.

**Пример.** В класс [BookTable](./orm-concepts.md#book-model) добавлены два метода: `withTitle` выбирает поле `TITLE`, `withPublishedAfter` фильтрует книги по дате выпуска.

```php
namespace SomePartner\MyBooksCatalog;

use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Query\Query;
use Bitrix\Main\Type\Date;

class BookTable extends DataManager
{
    // getTableName() и getMap() — как в статье «Концепция ORM»

    // добавляет поле TITLE в выборку
    public static function withTitle(Query $query)
    {
        $query->addSelect('TITLE');
    }

    // добавляет условие по дате выпуска
    public static function withPublishedAfter(Query $query, Date $date)
    {
        $query->where('PUBLISH_DATE', '>=', $date);
    }
}

// Использование
$books = BookTable::query()
    ->withTitle()
    ->withPublishedAfter(new Date('2020-01-01', 'Y-m-d'))
    ->fetchCollection() // выполняет запрос и возвращает коллекцию объектов
;
// SELECT `TITLE` ... WHERE `PUBLISH_DATE` >= '2020-01-01'
```

1. Метод `withTitle` добавляет поле `TITLE` в выборку методом `addSelect`.

2. Метод `withPublishedAfter` получает дату вторым аргументом и добавляет условие `PUBLISH_DATE >= дата`.

3. Методы `with*` можно комбинировать в одной цепочке, в отличие от `setDefaultScope` они действуют только в том запросе, где вызваны.

## Выборки в отношениях 1:N и N:M

При работе с отношениями 1:N и N:M могут возникнуть две основные проблемы.

### Некорректная работа LIMIT

При использовании метода `setLimit` в запросах с отношениями 1:N и N:M может возникнуть неожиданное поведение. Ограничение LIMIT применяется на уровне SQL-запроса и ограничивает общее количество строк в результате, включая связанные записи. Например, если у книги несколько авторов, каждая пара «книга — автор» считается отдельной строкой. В результате вместо ожидаемых 5 книг может быть выбрано меньше, либо одна книга с неполным списком авторов.

```php
$query = BookTable::query()
    ->addSelect('TITLE')
    ->addSelect('AUTHORS')
    ->setLimit(5)
;
$books = $query->fetchCollection();

// SQL-запрос:
/*
SELECT ... FROM `my_book`
LEFT JOIN `my_book_author` ...
LIMIT 5
*/
```

### Декартово произведение при выборке нескольких отношений

Декартово произведение возникает, когда каждая строка одной таблицы соединяется с каждой строкой другой таблицы, что приводит к резкому увеличению количества строк в результате. При выборке нескольких связанных полей в одном запросе результат может значительно увеличиваться в размере.

```php
$query = BookTable::query()
    ->addSelect('TITLE')
    ->addSelect('AUTHORS')
    ->addSelect('STORE_ITEMS')
;
$books = $query->fetchCollection();

// SQL-запрос
/*
SELECT ... FROM `my_book`
LEFT JOIN `my_book_author` ... // 15 значений
LEFT JOIN `my_store_book` ... // 7 значений
*/
```

-  Каждое добавленное свойство создает LEFT JOIN

-  Результат представляет декартово произведение всех связанных записей.

-  Если у книги 15 авторов и 7 записей о наличии в магазинах, будет выбрано 15 \* 7 = 105 строк вместо ожидаемых 15 + 7 = 22 строки.

-  Это может привести к нехватке памяти и снижению производительности при большом количестве свойств или значений.

### Решение проблем {#decompose}

Для решения этих проблем используется метод `decompose` класса `Bitrix\Main\ORM\Query\QueryHelper`.

```php
public static function decompose(Query $query, $fairLimit = true, $separateRelations = true)
```

| Параметр | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `$query` | [`Query`](../api-reference/main/orm/query/query/index.md) | — | Подготовленный, но не выполненный запрос с `select`, `filter`, `order`, `limit` |
| `$fairLimit` | `bool` | `true` | Разбивает запрос на два этапа: сначала выбирает уникальные первичные ключи основных записей с учетом `LIMIT` и `OFFSET`, затем для найденных ключей выбирает все поля и отношения |
| `$separateRelations` | `bool` | `true` | Выбирает каждое отношение 1:N или N:M отдельным запросом, что исключает декартово произведение |

Метод сам выполняет запрос, поэтому `fetchCollection()` вызывать не нужно. Метод изменяет переданный `$query`: при `$fairLimit` = `true` заменяет `select` на первичный ключ и включает `DISTINCT`. После вызова не используйте этот объект повторно. Метод возвращает [коллекцию объектов](./collections.md) с объединенными данными. Если основных записей нет, возвращается пустая коллекция.

{% note warning "" %}

При `$fairLimit` = `true` второй запрос и запросы связей фильтруются только по найденным первичным ключам. Условие по полю связи, например `AUTHORS.LAST_NAME`, отбирает основные записи, но не сужает список загруженных связей: у найденной книги загрузятся все авторы.

{% endnote %}

**Пример.** Выбрать пять книг со всеми авторами и записями о наличии в магазинах:

```php
use Bitrix\Main\ORM\Query\QueryHelper;

$query = BookTable::query()
    ->addSelect('TITLE')
    ->addSelect('AUTHORS')
    ->addSelect('STORE_ITEMS')
    ->setOrder(['ID' => 'ASC'])
    ->setLimit(5)
;

$books = QueryHelper::decompose($query); // до 5 книг, связи выбраны отдельными запросами

foreach ($books as $book)
{
    $authors = $book->getAuthors(); // коллекция авторов книги
}
```

Сортировка применяется только к основным записям. Порядок объектов отношений внутри основных записей не гарантируется. Связи `AUTHORS` и `STORE_ITEMS` описаны в статье [Концепция ORM](./orm-concepts.md#book-model), типы связей — в статье [Отношения между сущностями](./entity-relations.md).

## Фильтр ORM {#orm-filter}

Фильтр ORM задает условия выборки вызовами методов `where*` на объекте [`Query`](../api-reference/main/orm/query/query/index.md), а не массивом. Условия хранятся в объекте [`Bitrix\Main\ORM\Query\Filter\ConditionTree`](../api-reference/main/orm/query/filter/condition-tree/index.md). Такой фильтр удобен, когда условия собираются в коде по шагам. Подробнее об объекте `Query` — в статье [Построитель запросов](./query-builder.md).

Примеры раздела используют системный класс пользователей [`\Bitrix\Main\UserTable`](../api-reference/main/user-table/index.md).

Методы `having*` — псевдонимы методов `where*` с теми же аргументами: `Query` заменяет префикс `having` на `where` и вызывает тот же метод фильтра.

### Одиночные условия

#### Простое условие

Для выборки данных по конкретному условию используйте метод `where`. Например, чтобы выбрать пользователя с `ID = 1`:

```php
\Bitrix\Main\UserTable::query()
    ->where('ID', 1)
    ->exec()
;
// WHERE `main_user`.`ID` = 1
```

#### Другие операторы

Оператор передают вторым аргументом. Например, чтобы выбрать пользователей с `ID` меньше 10:

```php
\Bitrix\Main\UserTable::query()
    ->where('ID', '<', 10)
    ->exec()
;
// WHERE `main_user`.`ID` < 10
```

Доступные операторы: `=`, `<>`, `!=`, `<`, `<=`, `>`, `>=`, `in`, `between`, `like`, `exists`, `match`, `expr`. Полный список возвращает метод `\Bitrix\Main\ORM\Query\Filter\Operator::get()`. Неизвестный оператор вызывает исключение `Bitrix\Main\ArgumentException` с текстом `Unknown operator`. Операторы указывают в нижнем регистре: `'IN'` или `'LIKE'` вызовут это исключение.

#### Дополнительные методы

| Метод | Условие |
|---|---|
| `whereNull($column)` | Значение равно `NULL` |
| `whereIn($column, $values)` | Значение входит в список. `$values` — массив, объект `Query` или `SqlExpression`. Пустой массив условие не добавляет — запрос выберет все записи |
| `whereBetween($column, $valueMin, $valueMax)` | Значение находится в диапазоне |
| `whereLike($column, $value)` | Значение соответствует шаблону `LIKE` |
| `whereExists($query)` | Подзапрос `Query` или `SqlExpression` возвращает строки |
| `whereMatch($column, $value)` | Полнотекстовый поиск по полю |

**Пример.** Выбрать записи, где `ID` равно `NULL`:

```php
\Bitrix\Main\UserTable::query()
    ->whereNull('ID')
    ->exec()
;
// WHERE `main_user`.`ID` IS NULL
```

#### Методы whereNot*

Для каждого метода из таблицы существует аналог с отрицанием: `whereNotNull`, `whereNotIn`, `whereNotBetween`, `whereNotLike`, `whereNotExists`, `whereNotMatch`. Метод `whereNot` принимает те же аргументы, что `where`, и оборачивает условие в `NOT`.

**Пример.** Выбрать записи, где `ID` не равно `NULL`:

```php
\Bitrix\Main\UserTable::query()
    ->whereNotNull('ID')
    ->exec()
;
// WHERE `main_user`.`ID` IS NOT NULL
```

#### Произвольные выражения с whereExpr

Для сложных условий используйте `whereExpr`, который позволяет задавать произвольные SQL-выражения:

```php
\Bitrix\Main\UserTable::query()
    ->whereExpr('JSON_CONTAINS(%s, 4)', ['SOME_JSON_FIELD'])
    ->exec()
;
// WHERE JSON_CONTAINS(`main_user`.`SOME_JSON_FIELD`, 4)
```

Аргументы выражения аналогичны конструктору поля [`ExpressionField`](../api-reference/main/orm/fields/expression-field/index.md) и подставляются через `sprintf`. `SOME_JSON_FIELD` в примере — условное имя поля с JSON.

{% note warning "" %}

Текст выражения попадает в SQL без изменений. Функция `JSON_CONTAINS()` из примера есть только в MySQL, на PostgreSQL такой запрос завершится ошибкой. Для модуля, который работает с обеими СУБД, используйте конструкции из статьи [Как писать код, совместимый с PostgreSQL](./../database/postgresql/compatible-code.md).

{% endnote %}

#### Сравнение с другим полем

Метод `whereColumn` сравнивает значения двух полей.

```php
\Bitrix\Main\UserTable::query()
    ->whereColumn('NAME', 'LOGIN')
    ->exec()
;
// WHERE `main_user`.`NAME` = `main_user`.`LOGIN`
```

Этот метод аналогичен вызову:

```php
\Bitrix\Main\UserTable::query()
    ->where('NAME', new \Bitrix\Main\ORM\Query\Filter\Expressions\ColumnExpression('LOGIN'))
    ->exec()
;
// WHERE `main_user`.`NAME` = `main_user`.`LOGIN`
```

В `whereIn` тоже можно передать поля вместо значений:

```php
\Bitrix\Main\UserTable::query()
    ->whereIn('LOGIN', [
        new \Bitrix\Main\ORM\Query\Filter\Expressions\ColumnExpression('NAME'),
        new \Bitrix\Main\ORM\Query\Filter\Expressions\ColumnExpression('LAST_NAME'),
    ])
    ->exec()
;
// WHERE `main_user`.`LOGIN` IN (`main_user`.`NAME`, `main_user`.`LAST_NAME`)
```

Объект `ColumnExpression` воспринимается как поле сущности, а не произвольное SQL-выражение.

### Множественные условия

Используйте метод `where` несколько раз, чтобы добавлять несколько условий в запрос:

```php
\Bitrix\Main\UserTable::query()
    ->where('ID', '>', 1)
    ->where('ACTIVE', true)
    ->whereNotNull('PERSONAL_BIRTHDAY')
    ->whereLike('NAME', 'A%')
    ->exec()
;
// WHERE `main_user`.`ID` > 1 AND `main_user`.`ACTIVE` = 'Y' AND `main_user`.`PERSONAL_BIRTHDAY` IS NOT NULL AND `main_user`.`NAME` LIKE 'A%'
```

{% note info "" %}

Для boolean полей со значениями `Y/N`, `1/0` и так далее, можно использовать `true` и `false` в условиях.

{% endnote %}

Несколько условий можно указать в одном вызове `where`:

```php
\Bitrix\Main\UserTable::query()
    ->where([
        ['ID', '>', 1],
        ['ACTIVE', true],
        ['PERSONAL_BIRTHDAY', '<>', null],
        ['NAME', 'like', 'A%']
    ])
    ->exec()
;
// WHERE `main_user`.`ID` > 1 AND `main_user`.`ACTIVE` = 'Y' AND `main_user`.`PERSONAL_BIRTHDAY` IS NOT NULL AND `main_user`.`NAME` LIKE 'A%'
```

### OR и вложенные фильтры

Для хранения условий фильтра используется контейнер `\Bitrix\Main\ORM\Query\Filter\ConditionTree`. Он позволяет добавлять другие экземпляры `ConditionTree` для создания вложенных условий. Новый пустой контейнер создает метод [`Query::filter()`](../api-reference/main/orm/query/query/filter.md).

#### Вложенные фильтры

Вложенный фильтр объединяет группу условий:

```php
use Bitrix\Main\ORM\Query\Query;

\Bitrix\Main\UserTable::query()
    ->where(Query::filter()->where([
        ['ID', '>', 1],
        ['ACTIVE', true],
    ]))
    ->exec()
;
// WHERE `main_user`.`ID` > 1 AND `main_user`.`ACTIVE` = 'Y'
```

#### Логика OR

Для объединения условий с логикой `OR`:

```php
use Bitrix\Main\ORM\Query\Query;

\Bitrix\Main\UserTable::query()
    ->where('ACTIVE', true)
    ->where(Query::filter()
        ->logic('or')
        ->where([
            ['ID', 1],
            ['LOGIN', 'admin'],
        ])
    )
    ->exec()
;
// WHERE `main_user`.`ACTIVE` = 'Y' AND (`main_user`.`ID` = 1 OR `main_user`.`LOGIN` = 'admin')
```

#### Цепочка вызовов с OR

Условия с `OR` можно задать и цепочкой вызовов:

```php
use Bitrix\Main\ORM\Query\Query;

\Bitrix\Main\UserTable::query()
    ->where('ACTIVE', true)
    ->where(Query::filter()
        ->logic('or')
        ->where('ID', 1)
        ->where('LOGIN', 'admin')
    )
    ->exec()
;
// WHERE `main_user`.`ACTIVE` = 'Y' AND (`main_user`.`ID` = 1 OR `main_user`.`LOGIN` = 'admin')
```

### Выражения

В фильтре можно использовать `ExpressionField`, который автоматически регистрируется как runtime поле. Это позволяет создавать сложные условия:

```php
use Bitrix\Main\ORM\Fields\ExpressionField;

\Bitrix\Main\UserTable::query()
    ->where(new ExpressionField('LNG', 'LENGTH(%s)', 'LAST_NAME'), '>', 10)
    ->exec()
;
// WHERE LENGTH(`main_user`.`LAST_NAME`) > '10'
```

Метод [`Query::expr()`](../api-reference/main/orm/query/query/expr.md) возвращает хелпер, который строит такие выражения из SQL-функций без ручного описания `ExpressionField`:

```php
use Bitrix\Main\ORM\Query\Query;

\Bitrix\Main\UserTable::query()
    ->where(Query::expr()->length('LAST_NAME'), '>', 10)
    ->exec()
;
// WHERE LENGTH(`main_user`.`LAST_NAME`) > '10'

\Bitrix\Main\UserTable::query()
    ->addSelect(Query::expr()->count('ID'), 'CNT')
    ->exec()
;
// SELECT COUNT(`main_user`.`ID`) AS `CNT` FROM `b_user` `main_user`
```

Часто используемые SQL-выражения в хелпере:

-  `count` — подсчитывает количество строк

-  `countDistinct` — подсчитывает количество уникальных значений

-  `sum` — вычисляет сумму значений

-  `min` — находит минимальное значение

-  `avg` — вычисляет среднее значение

-  `max` — находит максимальное значение

-  `length` — определяет длину строки

-  `lower` — преобразует строку в нижний регистр

-  `upper` — преобразует строку в верхний регистр

-  `concat` — объединяет несколько строк в одну

### Совместимость с getList

При использовании `getList`, фильтр можно вставить вместо массива:

```php
use Bitrix\Main\ORM\Query\Query;

\Bitrix\Main\UserTable::getList([
    'filter' => ['=ID' => 1]
]);

\Bitrix\Main\UserTable::getList([
    'filter' => Query::filter()
        ->where('ID', 1)
]);
// WHERE `main_user`.`ID` = 1
```

### Условия JOIN

Референсы — это связи между таблицами, которые позволяют объединять данные из разных таблиц. Они описываются с помощью [`Reference`](../api-reference/main/orm/fields/relations/reference/index.md):

```php
use Bitrix\Main\GroupTable;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

new Reference('GROUP', GroupTable::class,
    Join::on('this.GROUP_ID', 'ref.ID')
)
```

Метод `on` — это сокращенная запись `Query::filter()` с предустановленным условием по колонкам. Он позволяет строить условия JOIN:

```php
use Bitrix\Main\GroupTable;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Filter\Expressions\ColumnExpression;
use Bitrix\Main\ORM\Query\Join;

new Reference('GROUP', GroupTable::class,
    Join::on('this.GROUP_ID', 'ref.ID')
        ->where('ref.ACTIVE', 'Y')
        ->where('ref.STRING_ID', new ColumnExpression('this.GROUP_CODE'))
)
```

Везде, где указывается имя поля, можно указать цепочку переходов по связям через точку. Например, связь `PUBLISHER` класса [BookTable](./orm-concepts.md#book-model) ведет к издательству, и фильтр по названию издательства записывается так:

```php
BookTable::query()
    ->addSelect('TITLE')
    ->where('PUBLISHER.TITLE', 'Example Press')
    ->fetchCollection()
;
// ... INNER JOIN издательств ... WHERE `PUBLISHER`.`TITLE` = 'Example Press'
```

Подробнее о связях — в статье [Отношения между сущностями](./entity-relations.md).

### Формат массива

Для использования фильтра в виде массива существует метод конвертации из массива в объект [`\Bitrix\Main\ORM\Query\Filter\ConditionTree::createFromArray`](../api-reference/main/orm/query/filter/condition-tree/create-from-array.md). Формат массива:

```php
$filter = [
    ['FIELD', '>', 2],
    [
        'logic' => 'or',
        ['FIELD', '<', 8],
        ['SOME', 9]
    ],
    ['FIELD', 'in', [5, 7, 11]],
    ['FIELD', '=', ['column' => 'FIELD2']],
    ['FIELD', 'in', [
        ['column' => 'FIELD1'],
        ['value' => 'FIELD2'],
        ['column' => 'FIELD3']
    ]],
    [
        'negative' => true,
        ['FIELD', '>', 19]
    ],
];
```

{% note warning "" %}

Будьте осторожны при использовании массивов. Не подставляйте сырые данные, переданные пользователем, в качестве фильтра — они могут содержать опасные условия для раскрытия данных БД. Проверяйте все входящие условия через [белый список полей](./../security/sql-injection.md).

{% endnote %}

#### Сравнение значений

-  Обычное сравнение: `['FIELD', '>', 2]`

-  С ключом `value`: `['FIELD', '>', ['value' => 2]]`

-  Сравнение с колонкой: `['FIELD1', '>', ['column' => 'FIELD2']]`

#### Вложенные фильтры и логика

Вложенные фильтры передаются в виде вложенных массивов. Для отрицания `negative()` и изменения логики `logic()` используются одноименные ключи в нижнем регистре: `'logic' => 'or'`, `'negative' => true`. Значение `logic` регистр не учитывает. Это отличается от массива `filter` метода `getList`, где ключ пишется как `'LOGIC'`, а значение — строго `'OR'`. Пример с обоими ключами — в начале раздела «Формат массива».

#### Операторы сравнения в массиве

Остальные методы `where*` заменяются соответствующими операторами сравнения `in`, `between`, `like` и так далее:

```php
['FIELD', 'in', [5, 7, 11]]
```

#### Применение массива

Метод `ConditionTree::createFromArray()` превращает массив в объект фильтра, который передают в `where` или в ключ `filter` метода `getList`:

```php
use Bitrix\Main\ORM\Query\Filter\ConditionTree;

$filter = ConditionTree::createFromArray([
    ['ID', '>', 1],
    ['ACTIVE', true],
]);

\Bitrix\Main\UserTable::query()
    ->addSelect('LOGIN')
    ->where($filter)
    ->fetchAll()
;
// WHERE `main_user`.`ID` > 1 AND `main_user`.`ACTIVE` = 'Y'
```

## Что дальше

-  [Построитель запросов](./query-builder.md) — объект `Query` и его методы,

-  [Объекты](./objects.md) и [Коллекции](./collections.md) — работа с результатом `fetchObject()` и `fetchCollection()`,

-  [Отношения между сущностями](./entity-relations.md) — связи `Reference`, `OneToMany`, `ManyToMany` и выборка связанных данных,

-  [Кеширование](./../performance/caching.md) — общий механизм кеша, на котором работает параметр `cache`.
