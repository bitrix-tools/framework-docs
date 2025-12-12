---
title: Выборка данных
description: 'Выборка данных. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Для выборки данных с фильтрацией, группировкой и сортировкой в Bitrix Framework используются метод `getList` и объект [`Entity\Query`](./query-builder).

## Метод getList

Метод `getList` универсален для всех сущностей и работает по общим правилам. Его невозможно изменить, но он дает гибкость для выполнения запросов.

Рассмотрим применение метода на примере сущности `BookTable`. Метод принимает параметры:

```php
$result = BookTable::getList([
    'select' => ['ISBN', 'TITLE', 'PUBLISH_DATE', 'CNT'], // поля, которые нужно получить
    'filter' => ['=ID' => 1], // условия фильтрации
    'group' => ['PUBLISH_DATE'], // поля для группировки
    'order' => ['PUBLISH_DATE' => 'DESC'], // параметры сортировки
    'limit' => 10, // количество записей
    'offset' => 0, // смещение для limit
    'runtime' => [ // динамически определенные поля
        new ORM\Fields\ExpressionField('CNT', 'COUNT(*)')
    ],
	'count_total' => true // список всех элементов без постраничного вывода

]);
```

-  `select` -- выбирает поля для выборки

-  `filter` -- задает условия фильтрации, аналогично `WHERE` в SQL

-  `group` -- группирует данные по указанным полям

-  `order` -- сортирует данные по указанным полям

-  `limit` и `offset` -- ограничивают количество записей и задают смещение

-  `runtime` -- добавляет временные поля, которые вычисляются во время выполнения запроса

-  `count_total` --  получает список всех элементов без постраничного вывода

#### Получение данных из результата

Метод `getList` возвращает объект `DB\Result`. Данные можно получить с помощью методов `fetch()` или `fetchAll()`.

```php
// Получение данных построчно
$rows = [];
$result = BookTable::getList($parameters);
while ($row = $result->fetch()) {
    $rows[] = $row;
}

// Получение всех данных сразу
$rows = BookTable::getList($parameters)->fetchAll();
```

#### Форматирование данных

Для изменения формата данных после выборки можно использовать метод `fetchDataModification()`. Например, изменить формат даты:

```php
class BookTable extends \Bitrix\Main\Entity\DataManager
{
    public static function fetchDataModification(): array
    {
        return [
            function ($data) {
                if (isset($data['PUBLISH_DATE'])) {
                    $data['PUBLISH_DATE'] = date('d.m.Y', strtotime($data['PUBLISH_DATE']));
                }
                return $data;
            }
        ];
    }
}

// Использование
$result = BookTable::getList($parameters);
$rows = $result->fetchAll();
```

### Параметры метода getList

#### Select

Параметр `select` задается как массив с именами полей сущности.

```php
BookTable::getList([
    'select' => ['ISBN', 'TITLE', 'PUBLISH_DATE']
]);
// SELECT ISBN, TITLE, PUBLISH_DATE FROM my_book
```

Чтобы изменить названия полей, используйте алиасы. Алиасы позволяют переименовывать поля в результирующем наборе данных для удобства. Например, чтобы поле `PUBLISH_DATE` отображалось как `PUBLICATION`:

```php
BookTable::getList([
    'select' => ['ISBN', 'TITLE', 'PUBLICATION' => 'PUBLISH_DATE']
]);
// SELECT ISBN, TITLE, PUBLISH_DATE AS PUBLICATION FROM my_book
```

Для выбора всех полей используйте символ `*`.

```php
BookTable::getList([
    'select' => ['*']
]);
```

При этом выберутся только скалярные поля `ScalarField`. Скалярные поля -- это обычные поля таблицы. Вычисляемые поля `ExpressionField` и связи с другими сущностями нужно указывать в запросе. Они создаются на основе выражений и не являются частью таблицы по умолчанию.

#### Filter

Параметр `filter` задает условия для выборки данных в виде ассоциативного массива. Ключи массива это условия, а значения -- параметры для поиска.

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

Фильтр может быть многоуровневым с использованием `AND` или `OR`, что позволяет комбинировать условия:

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

**Операторы сравнения**

Операторы сравнения позволяют задавать условия фильтрации.

-  `=` -- равно, работает и с массивами

-  `%` -- подстрока

-  `>` -- больше

-  `<` -- меньше

-  `@` -- IN (EXPR), принимает массив или объект `DB\SqlExpression`

-  `!@` -- NOT IN (EXPR), принимает массив или объект `DB\SqlExpression`

-  `!=` -- не равно

-  `!%` -- не подстрока

-  `><` -- между, принимает массив `array(MIN, MAX)`

-  `>=` -- больше или равно

-  `<=` -- меньше или равно

-  `=%` -- ищет строки, которые начинаются с указанного значения. Аналог оператора LIKE в SQL

-  `%=` -- ищет строки, которые заканчиваются указанным значением. Аналог оператора LIKE в SQL

**Префиксы**

Префиксы `%=` и `=%` эквивалентны и используются для поиска подстрок.

-  `'%=NAME' => 'тест'` -- аналог LIKE, не подстрока

-  `'%=NAME' => 'тест%'` -- содержит «тест» в начале

-  `'%=NAME' => '%тест'` -- содержит «тест» в конце

-  `'%=NAME' => '%тест%'` -- содержит подстроку «тест»

Последний вариант отличается от `'%NAME' => 'тест'` итоговым SQL-запросом.

-  `==` -- булево выражение для `ExpressionField`, например, `EXISTS()` или `NOT EXISTS()`

-  `!><` -- не между, принимает массив `array(MIN, MAX)`

-  `!=%` -- NOT LIKE

-  `!%=` -- NOT LIKE

-  `'==ID' => null` -- ID равно NULL. В SQL -- `ID IS NULL`

-  `'!==NAME' => null` -- NAME не равно NULL. В SQL -- `NAME IS NOT NULL`

{% note warning "" %}

Если не указан оператор `=`, по умолчанию используется LIKE -- поиск строки, которая содержит указанное значение в любом месте.

{% endnote %}

**Для полей типа int**

Если передать массив значений в фильтр для поля типа `int`, фреймворк автоматически преобразует это в SQL-запрос с использованием `IN()`. Оператор `IN` проверит, входит ли значение поля в указанный список.

```php
$result = BookTable::getList([
    'filter' => [
        'ID' => [1, 2, 3] // Массив значений для фильтрации
    ]
]);

// Bitrix ORM преобразует этот запрос в SQL:
// SELECT * FROM book_table WHERE ID IN (1, 2, 3);
```

#### Group

Параметр `group` задает поля для группировки. Это позволяет объединять записи с одинаковыми значениями в указанных полях:

```php
BookTable::getList([
    'group' => ['PUBLISH_DATE']
]);
```

Чаще всего группировку указывать не нужно -- система сделает это автоматически.

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

-  `ASC` -- по возрастанию

-  `DESC` -- по убыванию

#### Limit и Offset

Параметры `limit` и `offset`  ограничивают количество записей и создают постраничную выборку.

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

#### Runtime

Параметр `runtime` добавляет временные поля, которые вычисляются во время выполнения запроса.

**Пример подсчета записей**\
Для подсчета количества записей используйте `ExpressionField`:

```php
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

**Использование в фильтрах**\
После того, как добавили вычисляемое поле, его можно использовать в фильтрах:

```php
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

**Регистрация других типов полей**

В `runtime` можно регистрировать не только `Expression` поля, но и другие типы. Механизм `runtime` добавляет поле к сущности, как если бы оно было описано в `getMap`. Однако такое поле доступно только в рамках одного запроса и требует повторной регистрации в следующем вызове `getList`.

**Вычисляемые поля без runtime**

Если вычисляемое поле нужно только в `select`, `runtime` можно не использовать. Система поддерживает вложенные выражения, которые разворачиваются в финальном SQL.

```php
BookTable::getList([
    'select' => [
        new ORM\Fields\ExpressionField('MAX_AGE', 'MAX(%s)', ['AGE_DAYS'])
    ]
]);
// SELECT MAX(DATEDIFF(NOW(), PUBLISH_DATE)) AS MAX_AGE FROM my_book
```

-  Создается вычисляемое поле `MAX_AGE` через `ExpressionField`

-  Используется вложенное выражение `MAX(%s)`, где `%s` заменяется на `AGE_DAYS`

-  `AGE_DAYS` автоматически разворачивается в `DATEDIFF(NOW(), PUBLISH_DATE)`

Вложенные выражения разворачиваются последовательно.

#### Count_total

Чтобы получить список всех элементов без постраничного вывода, используйте параметр `count_total` со значением `true`:

```php
$res = MyTable::getList([
    /* ваши параметры запроса */
    'count_total' => true,
]);
```

Это позволяет получить весь список в один запрос.

```php
$res->getCount(); // все элементы без пагинации
```

### Кеширование выборки

Кеширование выборки позволяет сохранять результаты запросов для повторного использования. По умолчанию кеширование отключено.

Для включения кеширования используйте ключ `cache` в методе `getList`:

```php
$res = \Bitrix\Main\GroupTable::getList([
    'filter' => ['=ID' => 1],
    'cache' => ['ttl' => 3600] // Время жизни кеша в секундах
]);
```

То же самое можно сделать с помощью объекта `Query`:

```php
$query = \Bitrix\Main\GroupTable::query();
$query->setSelect(['*']);
$query->setFilter(['=ID' => 1]);
$query->setCacheTtl(150);
$res = $query->exec();
```

**Особенности кеширования**

-  Если данные найдены в кеше, в результате кешированной выборки вернется объект `ArrayResult`.

-  По умолчанию выборки с `JOIN` не кешируются. Чтобы включить кеширование  с `JOIN` используйте ключ `cache_joins`.

```php
"cache" => ["ttl" => 3600, "cache_joins" => true];
// или
$query->cacheJoins(true);
```

**Сброс кеша**

Кеш автоматически сбрасывается при вызове методов `add`, `update`, `delete`. Для принудительного сброса кеша используйте метод `cleanCache()`.

```php
/* Пример для таблицы пользователей */
\Bitrix\Main\UserTable::getEntity()->cleanCache();
```

**Настройки администратора**

Администратор проекта может запретить кеширование или изменить время жизни кеша TTL.

## Короткие вызовы

Для упрощения работы с данными, помимо метода `getList`, доступны более короткие методы:

-  `getById($id)` -- выборка по первичному ключу.

-  `getByPrimary($primary, array $parameters)` -- выборка по первичному ключу с дополнительными параметрами.

В обоих методах `id` можно передавать как число или массив. Массив используется, если есть несколько первичных полей. Если элемент массива не является первичным ключом, возникнет ошибка.

```php
BookTable::getById(1);
BookTable::getByPrimary(['ID' => 1]);

// Эти вызовы аналогичны следующему вызову getList:
BookTable::getList([
    'filter' => ['=ID' => 1]
]);
```

-  `getRowById($id)` -- выборка по первичному ключу, возвращает массив данных.

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

-  `getRow(array $parameters)` -- выборка по другим параметрам, возвращает одну запись.

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

## Предустановленные выборки

Предустановленные выборки позволяют заранее задавать параметры для выборки данных: фильтры, сортировки или выбор полей. Их можно разделить на два уровня:

1. Глобальная область данных -- настройки применяются ко всем запросам, связанным с определенной сущностью.

2. Локальная область данных -- настройки применяются только к конкретному запросу и могут быть изменены.

### Глобальная область данных

Одну таблицу можно описать несколькими сущностями, разделив записи на сегменты. Метод `setDefaultScope` выполняется при каждом запросе, задавая фильтры и другие параметры.

```php
class Element4Table extends \Bitrix\Iblock\ElementTable
{
    public static function getTableName()
    {
        return 'b_iblock_element';
    }
    public static function setDefaultScope(Query $query)
    {
        $query->where("IBLOCK_ID", 4);
    }
}

class Element5Table extends \Bitrix\Iblock\ElementTable
{
    public static function getTableName()
    {
        return 'b_iblock_element';
    }
    public static function setDefaultScope(Query $query)
    {
        $query->where("IBLOCK_ID", 5);
    }
}
```

1. `getTableName`  указывает имя общей таблицы `b_iblock_element`. Ее используют обе сущности.

2. `setDefaultScope` определяет дополнительные условия для каждого запроса:

   -  в классе `Element4Table` фильтруются записи с `IBLOCK_ID = 4`.

   -  в классе `Element5Table` фильтруются записи с `IBLOCK_ID = 5`.

Хотя обе сущности работают с одной таблицей, они оперируют разными наборами данных благодаря настроенным фильтрам.

### Локальная область данных

На пользовательском уровне можно задавать предустановленные выборки с помощью методов `with*`, аналога `setDefaultScope`.

```php
class UserTable
{
    // Метод withActive добавляет условие фильтрации по полю ACTIVE   
    public static function withActive(Query $query)
    {
        $query->where('ACTIVE', true); // Фильтр ACTIVE = true
    }
}

// Использование метода withActive
$activeUsers = UserTable::query()
    ->withActive() // Применяем фильтр для активных пользователей   
    ->fetchCollection(); // Выполняем запрос и получаем коллекцию
// WHERE `ACTIVE`='Y'
```

1. Метод `withActive` добавляет условие `WHERE ACTIVE = true` к запросу.

2. Запрос выполняется только для активных пользователей.

Метод принимает объект `Bitrix\Main\ORM\Query\Query`, позволяя задавать фильтры и другие параметры. Можно добавить свои аргументы:

```php
class UserTable
{
    // Метод withActive принимает значение для фильтрации и добавляет поле LOGIN в выборку
    public static function withActive(Query $query, $value)
    {
        $query
            ->addSelect('LOGIN') // Добавляем поле LOGIN в выборку
            ->where('ACTIVE', $value); // Фильтр ACTIVE = $value   
    }
}

// Использование метода withActive
$activeUsers = UserTable::query()
    ->withActive(false) // Применяем фильтр для неактивных пользователей
    ->fetchCollection(); // Выполняем запрос и получаем коллекцию
    
// SELECT `LOGIN` ... WHERE `ACTIVE`='N'
```

1. Метод `withActive` добавляет поле `LOGIN` в выборку с помощью `addSelect`.

2. Фильтр `WHERE ACTIVE = $value` применяется в зависимости от переданного значения. В примере передаем `false`.

3. Запрос выполняется для неактивных пользователей `ACTIVE = 'N'`.

## Выбор данных из хранимых процедур вместо таблиц

ORM может использоваться для сложных запросов, таких как выборка данных из хранимых процедур в базе данных MSSQL. Хранимые процедуры -- это программы, заранее сохраненные на сервере базы данных, которые могут выполнять сложные операции и возвращать результаты.

### Проблема с именами хранимых процедур

При попытке указать хранимую процедуру вместо имени таблицы в методе `getTableName`, возникает ошибка:

```php
public static function getTableName()
{
    // return "foo_table_name"
    return "foo_table_procedure()";
}

/* ошибка */
// MS Sql query error: Invalid object name 'foo_table_procedure()'. (400)
// SELECT [base].[bar] AS [BAR], [base].[baz] AS [BAZ], FROM [foo_table_procedure()] [base]
```

Система автоматически добавляет квадратные скобки вокруг имени хранимой процедуры, что делает запрос некорректным.

### Решение проблемы

Чтобы использовать хранимые процедуры, нужно создать собственный класс `SqlHelper`:

1. Установите расширение `mssql` на сервере

2. Создайте новый класс, унаследованный от `Bitrix\Main\DB\SqlHelper`

   ```php
   class MssqlSqlHelper extends \Bitrix\Main\DB\SqlHelper
   {
       public function quote($identifier)
       {
           if (self::isKnownFunctionCall($identifier)) {
               return $identifier;
           } else {
               return parent::quote($identifier);
           }
       }
   }
   ```

3. Реализуйте метод `isKnownFunctionCall`, который проверяет, является ли `$identifier` вызовом хранимой процедуры, например, `"foo_table_procedure()"`.

#### Как работает решение

-  Если `$identifier` является вызовом хранимой процедуры, квадратные скобки не добавляются

-  Для обычных таблиц сохраняется стандартное поведение с экранированием

## Выборки в отношениях 1:N и N:M

При работе с отношениями 1:N и N:M могут возникнуть две основные проблемы.

### Некорректная работа LIMIT

При использовании метода `setLimit` в запросах с отношениями 1:N и N:M может возникнуть неожиданное поведение. Ограничение LIMIT применяется на уровне SQL-запроса и ограничивает общее количество строк в результате, включая связанные записи. Например, если у элемента есть несколько значений для множественного свойства, каждое из этих значений будет считаться отдельной строкой. В результате вместо ожидаемых 5 элементов может быть выбрано меньше, либо один элемент с неполными значениями свойств.

```php
$query = BookTable::query()
    ->addSelect('NAME')
    ->addSelect('AUTHORS')
    ->setLimit(5);
$books = $query->fetchCollection();

// SQL-запрос:
/*
SELECT ... FROM `b_books`
LEFT JOIN `b_books_authors` ...
LIMIT 5 
*/
```

### Декартово произведение при выборке нескольких отношений

Декартово произведение возникает, когда каждая строка одной таблицы соединяется с каждой строкой другой таблицы, что приводит к резкому увеличению количества строк в результате. При выборке нескольких связанных полей в одном запросе результат может значительно увеличиваться в размере.

```php
$query = BookTable::query()
    ->addSelect('NAME')
    ->addSelect('AUTHORS')
    ->addSelect('CATEGORIES')
    ->addSelect('TAGS');
$books = $query->fetchCollection();

// SQL-запрос
/*
SELECT ... FROM `b_books`
LEFT JOIN `b_books_authors` ... // 15 значений
LEFT JOIN `b_books_categories` ... // 7 значений
LEFT JOIN `b_books_tags` ... // 11 значений
*/
```

-  Каждое добавленное свойство создает LEFT JOIN

-  Результат представляет декартово произведение всех связанных записей.

-  Если у свойств 15, 7 и 11 значений соответственно, будет выбрано 15 \* 7 \* 11 = 1155 строк вместо ожидаемых 15 + 7 + 11 = 33 строки.

-  Это может привести к нехватке памяти и снижению производительности при большом количестве свойств или значений.

### Решение проблем

Для решения этих проблем используется класс `Bitrix\Main\ORM\Query\QueryHelper` с методом `decompose`.

```php
public static function decompose(Query $query, $fairLimit = true, $separateRelations = true)
```

Метод имеет два основных параметра:

1. `fairLimit` . По умолчанию -- `true.` Разбивает запрос на два этапа:

   -  Сначала выбираются `ID` основных записей с учетом `LIMIT` и `OFFSET`

   -  Затем для найденных `ID` выбираются все отношения

2. `separateRelations`. По умолчанию -- `true.` Выбирает каждое отношение 1:N или N:M отдельным запросом, что исключает возникновение декартова произведения

В результате возвращается коллекция объектов с объединенными данными. Сортировка применяется только к основным записям. Порядок объектов отношений внутри основных обычно не имеет значения

## Фильтр ORM

Фильтр ORM позволяет задавать условия для выборки данных из базы.

### Одиночные условия

1. **Простой** **запрос**

   Для выборки данных по конкретному условию используйте метод `where`. Например, чтобы выбрать пользователя с `ID = 1`:

   ```php
   \Bitrix\Main\UserTable::query()
       ->where("ID", 1)
       ->exec();
   // WHERE `main_user`.`ID` = 1
   ```

2. **Использование других операторов**

   Вы можете использовать различные операторы для сравнения. Например, чтобы выбрать пользователей с ID меньше 10:

   ```php
   \Bitrix\Main\UserTable::query()
       ->where("ID", "<", 10)
       ->exec();
   // WHERE `main_user`.`ID` < 10
   ```

   В `\Bitrix\Main\ORM\Query\Filter\Operator::$operators` доступны следующие операторы: `=`, `<>`, `!=`, `<`, `<=`, `>`, `>=`, `in`, `between`, `like`, `exists`.

3. **Дополнительные методы**

   -  `whereNull($column)` -- является ли значение `NULL`.

   -  `whereIn($column, $values|Query|SqlExpression)` --  входит ли значение в указанный список

   -  `whereBetween($column, $valueMin, $valueMax)` --  находится ли значение в заданном диапазоне.

   -  `whereLike($column, $value)` --  соответствует ли значение шаблону.

   -  `whereExists($query|SqlExpression)` -- проверяет существование подзапроса.

   Пример. Выбрать записи, где `ID` равно `NULL`:

   ```php
   \Bitrix\Main\UserTable::query()
       ->whereNull("ID")
       ->exec();
   // WHERE `main_user`.`ID` IS NULL
   ```

4. **Методы whereNot\***

   Для каждого метода `where*` существует аналог `whereNot*`, например, `whereNotNull`, `whereNotIn`, и так далее.

   **Пример.** Выбрать записи, где `ID` равно `NOT NULL`:

   ```php
   \Bitrix\Main\UserTable::query()
       ->whereNotNull("ID")
       ->exec();
   // WHERE `main_user`.`ID` IS NOT NULL
   ```

5. **Произвольные выражения с whereExpr**

   Для сложных условий используйте `whereExpr`, который позволяет задавать произвольные SQL-выражения:

   ```php
   \Bitrix\Main\UserTable::query()
       ->whereExpr('JSON_CONTAINS(%s, 4)', ['SOME_JSON_FIELD'])
       ->exec();
   // WHERE JSON_CONTAINS(`main_user`.`SOME_JSON_FIELD`, 4)
   ```

   Аргументы выражения аналогичны конструктору поля `ExpressionField` и подставляются через `sprintf`.

6. **Сравнение** **с другим полем**

   Метод `whereColumn` упрощает сравнение полей:

   ```php
   \Bitrix\Main\UserTable::query()
       ->whereColumn('NAME', 'LOGIN')
       ->exec();
   // WHERE `main_user`.`NAME` = `main_user`.`LOGIN`
   ```

   Этот метод аналогичен вызову:

   ```php
   \Bitrix\Main\UserTable::query()
       ->where('NAME', new Query\Filter\Expression\Column('LOGIN'))
       ->exec();
   // WHERE `main_user`.`NAME` = `main_user`.`LOGIN`
   ```

   `whereIn` позволяет гибко использовать колонки в фильтре::

   ```php
   \Bitrix\Main\UserTable::query()
       ->whereIn('LOGIN', [
           new Column('NAME'),
           new Column('LAST_NAME')
       ])
       ->exec();
   // WHERE `main_user`.`LOGIN` IN (`main_user`.`NAME`, `main_user`.`LAST_NAME`)
   ```

   Колонки воспринимаются как поля сущностей, а не произвольные SQL-выражения.

### Множественные условия

Используйте метод `where` несколько раз, чтобы добавлять несколько условий в запрос:

```php
\Bitrix\Main\UserTable::query()
    ->where('ID', '>', 1)
    ->where('ACTIVE', true)
    ->whereNotNull('PERSONAL_BIRTHDAY')
    ->whereLike('NAME', 'A%')
    ->exec();
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
    ->exec();
// WHERE `main_user`.`ID` > 1 AND `main_user`.`ACTIVE` = 'Y' AND `main_user`.`PERSONAL_BIRTHDAY` IS NOT NULL AND `main_user`.`NAME` LIKE 'A%'
```

### OR и вложенные фильтры

Для хранения условий фильтра используется контейнер `\Bitrix\Main\Entity\Query\Filter\ConditionTree`. Он позволяет добавлять другие экземпляры `ConditionTree` для создания вложенных условий.

**Пример простого фильтра**

```php
\Bitrix\Main\UserTable::query()
    ->where([
        ['ID', '>', 1],
        ['ACTIVE', true]
    ])
    ->exec();
// WHERE `main_user`.`ID` > 1 AND `main_user`.`ACTIVE` = 'Y'
```

**Вложенные фильтры**\
Вы можете использовать вложенные фильтры для более сложных условий:

```php
use \Bitrix\Main\ORM\Query\Query;
\Bitrix\Main\UserTable::query()
    ->where(Query::filter()->where([
        ["ID", '>', 1],
        ['ACTIVE', true]
    ]))->exec();
// WHERE `main_user`.`ID` > 1 AND `main_user`.`ACTIVE` = 'Y'
```

**Использование логики OR**\
Для объединения условий с логикой `OR`:

```php
use \Bitrix\Main\ORM\Query\Query;
\Bitrix\Main\UserTable::query()
    ->where('ACTIVE', true)
    ->where(Query::filter()
        ->logic('or')
        ->where([
            ['ID', 1],
            ['LOGIN', 'admin']
        ])
    )->exec();
// WHERE `main_user`.`ACTIVE` = 'Y' AND (`main_user`.`ID` = 1 OR `main_user`.`LOGIN` = 'admin')
```

**Цепочка вызовов с OR**\
Вы также можете использовать цепочку вызовов для создания условий с `OR`:

```php
use \Bitrix\Main\ORM\Query\Query;
\Bitrix\Main\UserTable::query()
    ->where('ACTIVE', true)
    ->where(Query::filter()
        ->logic('or')
        ->where('ID', 1)
        ->where('LOGIN', 'admin')
    )
    ->exec();
// WHERE `main_user`.`ACTIVE` = 'Y' AND (`main_user`.`ID` = 1 OR `main_user`.`LOGIN` = 'admin')
```

### Выражения

В фильтре можно использовать `ExpressionField`, который автоматически регистрируется как runtime поле. Это позволяет создавать сложные условия:

```php
\Bitrix\Main\UserTable::query()
    ->where(new ExpressionField('LNG', 'LENGTH(%s)', 'LAST_NAME'), '>', 10)
    ->exec();
// WHERE LENGTH(`main_user`.`LAST_NAME`) > '10'
```

Для упрощения таких конструкций используйте хелпер. Хелпер -- это вспомогательный метод, который упрощает работу с выражениями. `Query::expr()` является хелпером, который позволяет использовать SQL-функции:

```php
\Bitrix\Main\UserTable::query()
    ->where(Query::expr()->length("LAST_NAME"), '>', 10)
    ->exec();
// WHERE LENGTH(`main_user`.`LAST_NAME`) > '10'

\Bitrix\Main\UserTable::query()
    ->addSelect(Query::expr()->count("ID"), 'CNT')
    ->exec();
// SELECT COUNT(`main_user`.`ID`) AS `CNT` FROM `b_user` `main_user`
```

Часто используемые SQL-выражения в хелпере:

-  `count` -- подсчитывает количество строк

-  `countDistinct` -- подсчитывает количество уникальных значений

-  `sum` -- вычисляет сумму значений

-  `min` -- находит минимальное значение

-  `avg` -- вычисляет среднее значение

-  `max` -- находит максимальное значение

-  `length` -- определяет длину строки

-  `lower` -- преобразует строку в нижний регистр

-  `upper` -- преобразует строку в верхний регистр

-  `concat` -- объединяет несколько строк в одну

### Совместимость с getList

При использовании `getList`, фильтр можно вставить вместо массива:

```php
use \Bitrix\Main\ORM\Query\Query;

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

Референсы -- это связи между таблицами, которые позволяют объединять данные из разных таблиц. Они описываются с помощью `ReferenceField`:

```php
new Entity\ReferenceField('GROUP', GroupTable::class,
    Join::on('this.GROUP_ID', 'ref.ID')
)
```

Метод `on` -- это сокращенная запись `Query::filter()` с предустановленным условием по колонкам. Он позволяет строить условия JOIN:

```php
new Entity\ReferenceField('GROUP', GroupTable::class,
    Join::on('this.GROUP_ID', 'ref.ID')
        ->where('ref.TYPE', 'admin')
        ->whereIn('ref.OPTION', [
            new Column('this.OPTION1'),
            new Column('this.OPTION2'),
            new Column('this.OPTION3')
        ])
)
```

Везде, где указывается имя поля, можно указать любую цепочку переходов:

```php
->whereColumn('this.AUTHOR.UserGroup:USER.GROUP.OWNER.ID', 'ref.ID');
```

### Формат массива

Для использования фильтра в виде массива существует метод конвертации из массива в объект `\Bitrix\Main\ORM\Query\Filter\ConditionTree::createFromArray`. Формат массива:

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
        ['FIELD3']
    ]],
    [
        'negative' => true,
        ['FIELD', '>', 19]
    ],
];
```

{% note warning "" %}

Будьте осторожны при использовании массивов. Не подставляйте сырые данные, переданные пользователем, в качестве фильтра -- они могут содержать опасные условия для раскрытия данных БД. Проверяйте все входящие условия через [белый список полей](./../security/sql-injection).

{% endnote %}

**Сравнение значений**

-  Обычное сравнение: `['FIELD', '>', 2]`

-  С ключом `value`: `['FIELD', '>', ['value' => 2]]`

-  Сравнение с колонкой: `['FIELD1', '>', ['column' => 'FIELD2']]`

**Вложенные фильтры и логика**

Вложенные фильтры передаются в виде вложенных массивов. Для отрицания `negative()` и изменения логики `logic()` используются одноименные ключи:

```php
$filter = [
    ['FIELD', '>', 2],
    [
        'logic' => 'or',
        ['FIELD', '<', 8],
        ['SOME', 9]
    ],
    [
        'negative' => true,
        ['FIELD', '>', 19]
    ]
]
```

**Операторы сравнения**

Остальные методы `where*` заменяются соответствующими операторами сравнения `in`, `between`, `like` и так далее:

```php
['FIELD', 'in', [5, 7, 11]]
```
