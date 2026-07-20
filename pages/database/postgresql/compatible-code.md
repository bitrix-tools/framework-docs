---
title: Как писать код, совместимый с PostgreSQL
description: 'Как писать код, совместимый с PostgreSQL. Работа с базой данных в Bitrix Framework: совместимые SQL-запросы и переносимость кода.'
---

Перед миграцией на PostgreSQL проверьте сторонние модули и доработки проекта. Найдите прямые SQL-запросы, замените специфичные функции MySQL и используйте совместимые методы Bitrix Framework.

{% note warning "" %}

Встроенный мигратор предназначен только для основного продукта. Он не работает со сторонними решениями.

Если сторонний модуль не поддерживает PostgreSQL, мастер миграции отключит его автоматически.

{% endnote %}

## Миграция сторонних модулей

Модули из [Битрикс24.Маркет](https://www.bitrix24.ru/apps/) работают через REST и не обращаются напрямую к базе данных.

Работоспособность модулей из [Маркетплейс 1С-Битрикс](https://marketplace.1c-bitrix.ru/about/) зависит от способа разработки модуля.

- Если модуль на ядре D7 и использует [Bitrix ORM](../../orm/orm-concepts.md), он работает без доработок.
- Если модуль не на ядре D7, он требует отдельной проверки совместимости с PostgreSQL.
- Если модуль на ядре D7 использует прямые запросы к СУБД или специфичные функции, он может потребовать доработки. За изменениями в коде обратитесь к разработчикам модуля.

## Как адаптировать модуль

### Схема данных

Для квотирования идентификаторов в PostgreSQL используются двойные кавычки.

PostgreSQL преобразует все неквотированные идентификаторы к нижнему регистру и ищет их в метаданных базы.

Для совместимости с кодом *1С-Битрикс: Управление сайтом* метод `fetch` преобразует все колонки к верхнему регистру.

Поэтому если создана таблица:

```sql
create table test (ID int)
```

в результате будет создана таблица `test` с колонкой `id` в нижнем регистре.

При выборке через *1С-Битрикс: Управление сайтом*:

```php
$rs = $DB->Query('SELECT ID from test');
```

Неквотированный `ID` будет сначала преобразован в нижний регистр, найден в метаданных и запрос выполнится.

Вот пример неправильного запроса:

```php
$rs = $DB->Query('SELECT "ID" from test');
```

При выборке данных:

```php
$ar = $rs->Fetch();
```

Метод `Fetch` автоматически преобразует колонку `id` в `ID`.

Если идентификатор нужно квотировать, используйте метод `quote` из [SqlHelper](https://dev.1c-bitrix.ru/api_d7/bitrix/main/db/sqlhelper/quote.php) или `CDatabase`.

В MySQL регистр не изменится. В PostgreSQL идентификатор сначала будет приведен к нижнему регистру. После этого он будет обрамлен двойными кавычками.

```php
$sql = 'SELECT ' . $DB->quote('ID') . ' from ' . $DB->quote('test');
```

Для MySQL код сформирует строку:

```sql
SELECT `ID` from `test`
```

Для PostgreSQL код сформирует строку:

```sql
SELECT "id" from "test"
```

Код будет работать с обеими СУБД.

### Типы колонок

Замените типы колонок, которые могут работать по-разному в MySQL и PostgreSQL:

- `timestamp` — на `datetime` с переносом логики на PHP;
- `enum` — на `char`, чтобы PostgreSQL не создавал отдельный тип для колонки;
- `char` — на `varchar`, если в колонке хранится строка переменной длины. PostgreSQL дополняет значение `char` пробелами справа до указанной длины поля.

В PostgreSQL нет модификатора `unsigned`, поэтому для него увеличивается разрядность хранения.

| MySQL | PostgreSQL |
| --- | --- |
| smallint | smallint |
| unsigned smallint | int |
| int | int |
| unsigned int | int8 |

Чаще всего `unsigned` используют не для ограничения хранения только положительных чисел, а как способ увеличить диапазон хранимых данных, например для результата `ip2long`. Чтобы упростить поддержку кода в разных базах, откажитесь от `unsigned` в MySQL с возможным увеличением разрядности хранения.

### Имена индексов

В MySQL имена индексов локальны по отношению к таблице, поэтому разные индексы у разных таблиц могут называться одинаково.

```sql
CREATE TABLE author (id int, name varchar(50), primary key (id), key ix_search(name));
CREATE TABLE book (id int, title varchar(50), primary key (id), key ix_search(title));
```

В PostgreSQL имена индексов должны быть уникальны в рамках схемы данных. Составляйте имена индексов:

- из префикса: `ux_` для уникальных, `tx_` для полнотекстовых и `ix_` для остальных,
- имени таблицы и разделителя `_`,
- имен столбцов, разделенных `_`.

{% note info "" %}

Максимальная длина имени индекса в PostgreSQL — 63 символа. Если имя индекса длиннее, обрежьте его. Если имя будет конфликтовать с другим индексом, добавьте числовой суффикс через `_`.

{% endnote %}

### Конвертация install.sql

```bash
$cd mymodule
$mkdir install/db/pgsql
$cp install/mysql/uninstall.sql install/pgsql/uninstall.sql
$php -f ../perfmon/tools/mysql_to_pgsql.php -- install/mysql/install.sql > install/pgsql/install.sql
```

### Использование специфичного квотирования

Использование обратных кавычек для экранирования идентификаторов в MySQL не подходит для PostgreSQL.

Такие конструкции нужно переписать с использованием методов `CDatabase::quote` или `SqlHelper::quote` либо убрать как ненужные или избыточные. Названия таблиц всегда в нижнем регистре, а названия столбцов — в верхнем.

### Строковые литералы

В отличие от MySQL, в PostgreSQL нельзя использовать двойные кавычки для строковых литералов. Замените их на одиночные кавычки.

MySQL и PostgreSQL по-разному интерпретируют обратные косые черты в строковых литералах.

Например, запрос:

```sql
select '\Bitrix'
```

В MySQL запрос вернет `"Bitrix"`, а в PostgreSQL — `"\Bitrix"`.

А запрос:

```sql
select '\\Bitrix'
```

В MySQL запрос вернет `"\Bitrix"`, а в PostgreSQL — `"\\Bitrix"`.

Чтобы избежать различий, используйте функцию `ForSql` из [SqlHelper](../sql-helper-and-expression.md) или `CDatabase`:

```php
$rs = $DB->Query("SELECT '" . $DB->ForSql("\\Bitrix") . "'")
```

Для обеих баз данных запрос вернет `"\Bitrix"`.

### Функции

Замените функции MySQL на стандартные SQL-конструкции или методы Bitrix Framework. Если функция используется в прямом SQL-запросе, перепишите запрос перед миграцией.

#### ifnull()

Замените `ifnull()` на `coalesce()`.

Было:

```sql
SELECT ID,ifnull(NAME, '') AS NAME FROM b_user
```

Стало:

```sql
SELECT ID,coalesce(NAME, '') AS NAME FROM b_user
```

#### mid()

Замените `mid()` на `substr()`.

#### if()

Замените `if()` на оператор `case when`.

Было:

```sql
SELECT ID, if(TIMESTAMP_X > now() , 'red', 'green') AS STATUS FROM b_user
```

Стало:

```sql
SELECT ID, case when TIMESTAMP_X > now() then 'red' else 'green' end AS STATUS FROM b_user
```

#### YEAR(), MONTH(), DAY()

Замените `YEAR()`, `MONTH()` и `DAY()` на `extract(... from ...)`.

Было:

```sql
SELECT ID, YEAR(TIMESTAMP_X) AS A_YEAR FROM b_user
```

Стало:

```sql
SELECT ID, extract(YEAR FROM TIMESTAMP_X) AS A_YEAR FROM b_user
```

#### LOCATE()

Замените `LOCATE()` на `position(... in ...)`.

Было:

```sql
SELECT ID, LOCATE(',',NAME) AS A_POS FROM b_user
```

Стало:

```sql
SELECT ID, POSITION(',' IN NAME) AS A_POS FROM b_user
```

#### get_lock() и release_lock()

Перепишите прямые запросы на методы `DatabaseConnection`.

```php
$lockName = 'mylock';
$connection = \Bitrix\Main\Application::getConnection();
if ($connection->lock($lockName))
{
    // ...
    $connection->unlock($lockName);
}
```

#### date_add() и date_sub()

Перепишите прямые запросы на методы [SqlHelper](../sql-helper-and-expression.md).

Было:

```php
$sql = 'SELECT ID, date_add(TIMESTAMP_X, interval 60 second) AS EXPIRATION_TIME FROM b_user';
```

Стало:

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();

$sql = 'SELECT ID, ' . $helper->addSecondsToDateTime(60, 'TIMESTAMP_X') . ' AS EXPIRATION_TIME FROM b_user';
```

Для `date_sub` вызовите с отрицательным значением.

Для `date_add(..., interval day)` используйте метод `addDaysToDateTime`.

#### date_format()

Перепишите с использованием метода `formatDate` из `\Bitrix\Main\Application::getConnection()->getSqlHelper()`.

#### concat()

Перепишите с использованием метода `getConcatFunction` из `\Bitrix\Main\Application::getConnection()->getSqlHelper()`.

#### date()

Перепишите с использованием метода `getCurrentDateFunction` из `\Bitrix\Main\Application::getConnection()->getSqlHelper()`.

#### rand()

Перепишите с использованием метода `getRandomFunction` из `\Bitrix\Main\Application::getConnection()->getSqlHelper()`.

#### sha1()

Перепишите с использованием метода `getSha1Function` из `\Bitrix\Main\Application::getConnection()->getSqlHelper()`.

#### group_concat()

Не используйте эту функцию, так как она может вернуть обрезанные данные. Подробности описаны в документации MySQL для функции [group_concat](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_group-concat).

### Запросы

`INSERT IGNORE`

Перепишите прямые запросы на методы [SqlHelper](../sql-helper-and-expression.md).

```php
$sql = 'INSERT IGNORE INTO b_user_group (USER_ID, GROUP_ID, DATE_ACTIVE_FROM, DATE_ACTIVE_TO) VALUES (...)';
$sql = 'INSERT IGNORE INTO b_user_access_check (USER_ID, PROVIDER_ID) SELECT ...';
```

Замените на:

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();

$sql = $helper->getInsertIgnore("b_user_group", "(USER_ID, GROUP_ID, DATE_ACTIVE_FROM, DATE_ACTIVE_TO)", "VALUES (...)");
$sql = $helper->getInsertIgnore("b_user_access_check", "(USER_ID, PROVIDER_ID)", "SELECT ...");
```

[Различия в CDatabase::PrepareInsert и SqlHelper::prepareInsert](#CDatabase)

`UPDATE IGNORE`

В PostgreSQL нет запроса с аналогичной логикой выполнения.

Обновление значений первичного или альтернативного ключа лучше заменить двумя запросами. Такая замена не полностью соответствует исходной логике, но обе БД будут вести себя одинаково.

```sql
INSERT IGNORE INTO ... SELECT ... WHERE
DELETE FROM ... WHERE
```

`REPLACE INTO`

Перепишите прямые запросы на методы `SqlHelper`.

```php
$sql = 'REPLACE INTO b_module_table (KEY_ID, DATA) VALUES (...)';
```

Измените на:

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();

$update = [
    'KEY_ID' => 1,
    'DATA' => 'a',
];
$merge = $helper->prepareMerge('b_module_table', ['KEY_ID'], $update, $update);
if ($merge[0])
{
    $connection->query($merge[0]);
}
//or another helper method
//$update - is a row in a rows array
foreach ($helper->prepareMergeMultiple('b_module_table', ['KEY_ID'], [$update]) as $sql)
{
    $connection->query($sql);
}
```

[Различия в CDatabase::PrepareInsert и SqlHelper::prepareInsert](#CDatabase)

`DELETE ... LIMIT`

Перепишите прямые запросы на методы `SqlHelper`:

```php
$sql = 'DELETE FROM b_test WHERE ACTIVE = 'N' ORDER BY TIMESTAMP_X ASC LIMIT 50';
```

Измените на:

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();

$sql = $helper->prepareDeleteLimit('b_test', ['ID'], "ACTIVE = 'N'", ['TIMESTAMP_X' => 'ASC'], 50);
```

- Коррелированный `UPDATE`.
- Коррелированный `DELETE`.

Эти запросы зависят от конкретной логики выборки и обновления данных. Перепишите их перед миграцией.

### Использование классов

- `MysqlCommonConnection`
- `MssqlConnection`
- `OracleConnection`

Проверьте код, который использует эти классы.

### Некоторые особенности

`CDatabase::Add` в таблицу без автоинкремента:

```php
$DB->Add("b_iblock_fields", $arAdd, array("DEFAULT_VALUE"));
```

Перепишите на прямой запрос:

```php
$arInsert = $DB->PrepareInsert("b_iblock_fields", $arAdd);
$DB->Query("INSERT INTO b_iblock_fields (".$arInsert[0].") VALUES (".$arInsert[1].")");
```

### Различия в CDatabase::PrepareInsert и SqlHelper::prepareInsert {#CDatabase}

- Поля типа дата/время обрабатываются по-разному.
- `CDatabase` учитывает настройку часовых поясов, а `SqlHelper` — нет.

Поэтому в методы хелпера передавайте объект даты и времени, созданный методом [`\Bitrix\Main\Type\DateTime::createFromUserTime`](../../advanced/datetime.md#methods). Например:

```php
$fields = [
    'DATE_REGISTER' => '01.01.2023 00:00:00',
];
print_r($DB->PrepareInsert('b_user', $fields));

$fields = [
    'DATE_REGISTER' => new \Bitrix\Main\Type\DateTime('01.01.2023 00:00:00'),
];
print_r(\Bitrix\Main\Application::getConnection()->getSqlHelper()->prepareInsert('b_user', $fields));

$fields = [
    'DATE_REGISTER' => \Bitrix\Main\Type\DateTime::createFromUserTime('01.01.2023 00:00:00'),
];
print_r(\Bitrix\Main\Application::getConnection()->getSqlHelper()->prepareInsert('b_user', $fields));
```

Выведет

```text
Array
(
    [0] => `DATE_REGISTER`
    [1] => DATE_ADD('2023-01-01 00:00:00', INTERVAL 3600 SECOND)
)
Array
(
    [0] => `DATE_REGISTER`
    [1] => '2023-01-01 00:00:00'
    [2] => Array
        (
        )
)
Array
(
    [0] => `DATE_REGISTER`
    [1] => '2023-01-01 01:00:00'
    [2] => Array
        (
        )
```

### Использование двойных кавычек

В PostgreSQL нельзя использовать двойные кавычки для строковых литералов. Заменяйте их на одиночные кавычки.
