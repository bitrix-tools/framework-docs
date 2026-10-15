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

Проверьте схему данных, установочные SQL-файлы и прямые запросы модуля. Для работы с базой данных используйте соединение из `Application::getConnection()` и его `SqlHelper`.

### Схема данных

Для квотирования идентификаторов в PostgreSQL используются двойные кавычки.

PostgreSQL преобразует все неквотированные идентификаторы к нижнему регистру и ищет их в метаданных базы.

При чтении результата через `fetch()` драйвер PostgreSQL в Bitrix Framework возвращает имена колонок в верхнем регистре.

Поэтому если создана таблица:

```sql
create table test (ID int)
```

в результате будет создана таблица `test` с колонкой `id` в нижнем регистре.

При выборке через *1С-Битрикс: Управление сайтом*:

```php
$connection = \Bitrix\Main\Application::getConnection();
$result = $connection->query('SELECT ID FROM test');
```

Неквотированный `ID` будет сначала преобразован в нижний регистр, найден в метаданных и запрос выполнится.

Прочитайте строку результата:

```php
$row = $result->fetch();
```

Метод `fetch()` вернет значение колонки `id` под ключом `ID`.

**Пример.** Запрос с `"ID"` завершится ошибкой, потому что колонки с таким именем в таблице нет:

```php
$connection = \Bitrix\Main\Application::getConnection();
$result = $connection->query('SELECT "ID" FROM test');
```

Если идентификатор нужно квотировать, используйте метод `SqlHelper::quote()`. Подробнее о нем — в статье [Формирование запросов](../sql-helper-and-expression.md).

В MySQL регистр не изменится. В PostgreSQL идентификатор сначала будет приведен к нижнему регистру. После этого он будет обрамлен двойными кавычками. Сформируйте запрос с помощью хелпера:

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();

$sql = 'SELECT ' . $helper->quote('ID') . ' FROM ' . $helper->quote('test');
$result = $connection->query($sql);
```

**Пример.** Для MySQL код сформирует строку:

```sql
SELECT `ID` FROM `test`
```

**Пример.** Для PostgreSQL код сформирует строку:

```sql
SELECT "id" FROM "test"
```

Код будет работать с обеими СУБД.

### Типы колонок

Замените типы колонок, которые могут работать по-разному в MySQL и PostgreSQL:

- `timestamp` — на `datetime` с переносом логики на PHP,
- `enum` — на `char`, чтобы PostgreSQL не создавал отдельный тип для колонки,
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

Разместите SQL-файлы PostgreSQL в каталоге `install/db/pgsql`. Проверьте, что установщик модуля выбирает этот каталог для соединения типа `pgsql`.

Для модуля с исходными SQL-файлами в `install/db/mysql` выполните команды из каталога `/bitrix/modules/`. Замените `mymodule` на имя модуля. Команды запишут файлы в `install/db/pgsql`, поэтому перед повторным запуском сохраните внесенные в них правки:

```bash prompt="$"
$ cd mymodule
$ mkdir -p install/db/pgsql
$ cp install/db/mysql/uninstall.sql install/db/pgsql/uninstall.sql
$ php -f ../perfmon/tools/mysql_to_pgsql.php -- install/db/mysql/install.sql > install/db/pgsql/install.sql
```

Проверьте скопированный `uninstall.sql` и результат конвертации `install.sql` на совместимость с PostgreSQL.

### Использование специфичного квотирования

Использование обратных кавычек для экранирования идентификаторов в MySQL не подходит для PostgreSQL.

Замените обратные кавычки вызовом `SqlHelper::quote()` или уберите квотирование, если оно не требуется. При вызове `quote()` для PostgreSQL хелпер приведет идентификатор к нижнему регистру и обрамит двойными кавычками.

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

Чтобы избежать различий, экранируйте значение методом `SqlHelper::forSql()` из статьи [Формирование запросов](../sql-helper-and-expression.md):

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();

$result = $connection->query("SELECT '" . $helper->forSql('\\Bitrix') . "'");
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

Для преобразования даты и времени в дату используйте метод `SqlHelper::getDatetimeToDateFunction()`. Передайте ему SQL-выражение или имя колонки, экранированное через `quote()`. Метод `getCurrentDateFunction()` возвращает текущую дату и не заменяет `date(значение)`.

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

$sql = $helper->getInsertIgnore('b_user_group', '(USER_ID, GROUP_ID, DATE_ACTIVE_FROM, DATE_ACTIVE_TO)', 'VALUES (...)');
$sql = $helper->getInsertIgnore('b_user_access_check', '(USER_ID, PROVIDER_ID)', 'SELECT ...');
```

При подготовке данных для вставки учитывайте [обработку дат и времени](#CDatabase).

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
    $connection->queryExecute($merge[0]);
}
```

Для замены нескольких записей используйте `prepareMergeMultiple()`:

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();
$rows = [
    ['KEY_ID' => 1, 'DATA' => 'a'],
];

foreach ($helper->prepareMergeMultiple('b_module_table', ['KEY_ID'], $rows) as $sql)
{
    $connection->queryExecute($sql);
}
```

При подготовке данных для вставки учитывайте [обработку дат и времени](#CDatabase).

`DELETE ... LIMIT`

Перепишите прямые запросы на методы `SqlHelper`:

```php
$sql = "DELETE FROM b_test WHERE ACTIVE = 'N' ORDER BY TIMESTAMP_X ASC LIMIT 50";
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

### Вставка в таблицу без автоинкремента

Для таблицы без автоинкремента подготовьте запрос методом `SqlHelper::prepareInsert()` и выполните его через `queryExecute()`. В примере таблица `b_module_table` содержит поля `KEY_ID` и `DATA`, а значение ключа задается в массиве данных:

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper();
$fields = [
    'KEY_ID' => 1,
    'DATA' => 'a',
];

[ $columns, $values, $binds ] = $helper->prepareInsert('b_module_table', $fields);
$sql = 'INSERT INTO ' . $helper->quote('b_module_table') . ' (' . $columns . ') VALUES (' . $values . ')';
$connection->queryExecute($sql, $binds);
```

Метод `prepareInsert()` возвращает список колонок, список значений и массив привязок. Передайте привязки вторым аргументом в `queryExecute()`.

### Даты и время при подготовке вставки {#CDatabase}

При переходе с `CDatabase::PrepareInsert()` на `SqlHelper::prepareInsert()` учитывайте различие в обработке часовых поясов. `SqlHelper` не применяет поправку пользовательского часового пояса автоматически.

Если дата задана в часовом поясе пользователя, создайте объект методом [`DateTime::createFromUserTime()`](../../advanced/datetime.md#methods) и передайте его в `prepareInsert()`:

```php
use Bitrix\Main\Application;
use Bitrix\Main\Type\DateTime;

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$fields = [
    'DATE_REGISTER' => DateTime::createFromUserTime('01.01.2023 00:00:00'),
];
[ $columns, $values, $binds ] = $helper->prepareInsert('b_user', $fields);
```

Если дата уже задана во времени сервера, передайте обычный объект `DateTime`. Результат преобразования пользовательской даты зависит от настроек часового пояса.

### Использование двойных кавычек {#double-quotes}

В PostgreSQL нельзя использовать двойные кавычки для строковых литералов. Заменяйте их на одиночные кавычки.
