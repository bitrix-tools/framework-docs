---
title: Выполнение запросов
description: 'Выполнение запросов. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

Объект соединения `\Bitrix\Main\DB\Connection` выполняет SQL-запросы к базе данных напрямую. Используйте его для таблиц без ORM-класса и для операций со структурой таблиц. Для таблиц с ORM-классом используйте [выборку данных ORM](../orm/querying-data.md).

Получите объект соединения:

```php
/** @var \Bitrix\Main\DB\Connection $db */
$db = \Bitrix\Main\Application::getConnection();
```

Метод `getConnection()` без аргумента возвращает соединение `default` из файла `/bitrix/.settings.php`. Чтобы получить другое соединение, передайте его имя. Настройка соединений описана в статье [Конфигурация](configuration.md).

## Методы выполнения запросов

Объект соединения выполняет SQL-запрос тремя методами. Методы отличаются результатом:

-  `query()` — возвращает объект `\Bitrix\Main\DB\Result` со строками выборки,

-  `queryScalar()` — возвращает значение первого столбца первой строки или `null`, если запрос не вернул строк,

-  `queryExecute()` — ничего не возвращает, подходит для запросов `INSERT`, `UPDATE` и `DELETE`.

Если СУБД возвращает ошибку, все три метода выбрасывают исключение `\Bitrix\Main\DB\SqlQueryException`. Обработка ошибок описана в разделе [Как обработать ошибку запроса](#query-errors).

### Аргументы метода `query()`

Метод `query()` объявляет один параметр `$sql`. Остальные аргументы метод разбирает по их числу и по типу второго аргумента. Если второй аргумент — массив, метод считает его массивом привязок `$binds`. Иначе второй аргумент — число.

Метод принимает шесть вариантов набора аргументов:

```php
$db->query($sql);
$db->query($sql, $limit);
$db->query($sql, $offset, $limit);
$db->query($sql, $binds);
$db->query($sql, $binds, $limit);
$db->query($sql, $binds, $offset, $limit);
```

*Обязательные параметры обозначены \*.*

| Параметр | Тип | Описание |
|---|---|---|
| `$sql`* | `string` | Текст SQL-запроса |
| `$binds` | `array` | Массив привязок для драйвера СУБД. По умолчанию пустой массив. Драйверы MySQL и PostgreSQL не подставляют эти значения в запрос |
| `$offset` | `int` | Число строк, которые нужно пропустить. Отсчет с `0`. По умолчанию `0`. Если `$limit` не больше нуля, метод смещение не применяет |
| `$limit` | `int` | Наибольшее число строк в результате. По умолчанию `0` — без ограничения |

При трех аргументах без массива второй аргумент задает смещение, а третий — лимит. Вызов `query($sql, 5, 10)` пропускает 5 строк и возвращает следующие 10.

Если `$limit` больше нуля, метод дописывает `LIMIT` в конец текста запроса через `SqlHelper::getTopSql()`. В MySQL метод добавляет `LIMIT смещение, лимит`, в PostgreSQL — `LIMIT лимит` и `OFFSET смещение`, если смещение больше нуля. Метод `queryScalar()` всегда дописывает `LIMIT` на одну строку. Поэтому не указывайте `LIMIT` в тексте запроса, если передаете `$limit` или вызываете `queryScalar()`.

## Как выполнять SELECT-запросы

Выполните базовый запрос:

```php
$result = $db->query('SELECT `ID`, `NAME` FROM b_user');
```

Ограничьте количество результатов:

```php
// Вернет первые 10 записей
$result = $db->query('SELECT `ID`, `NAME` FROM b_user', 10);
// SQL в MySQL: SELECT `ID`, `NAME` FROM b_user LIMIT 0, 10
```

Ограничьте количество результатов и задайте смещение:

```php
// Пропустит 5 записей и вернет следующие 10
$result = $db->query('SELECT `ID`, `NAME` FROM b_user', 5, 10);
// SQL в MySQL: SELECT `ID`, `NAME` FROM b_user LIMIT 5, 10
```

Получите скалярное значение:

```php
// Вернет значение первого столбца первой строки или null, если строк нет
$id = $db->queryScalar('SELECT `ID`, `NAME` FROM b_user');
// SQL в MySQL: SELECT `ID`, `NAME` FROM b_user LIMIT 0, 1
```

Выполните запрос без возврата результата и получите число измененных строк:

```php
$db->queryExecute("UPDATE b_user SET ACTIVE = 'Y' WHERE DATE_REGISTER > '2024-01-01'");
$count = $db->getAffectedRowsCount();
```

Метод `queryExecute()` ничего не возвращает. Метод соединения `getAffectedRowsCount()` возвращает число строк, которые изменил последний запрос.

Строковые значения в SQL заключайте в одинарные кавычки. Это соответствует [правилам совместимости с PostgreSQL](postgresql/compatible-code.md#double-quotes).

### Параметр binds

Методы `query()`, `queryScalar()` и `queryExecute()` принимают необязательный массив `$binds` после SQL-строки. Он передает драйверу дополнительные данные для привязки значений. Обработка массива зависит от драйвера. Например, драйвер Oracle использует его для записи текстовых данных в CLOB-поля.

Передайте в `queryExecute()` массив привязок, который вернул [`SqlHelper::prepareUpdate()`](../api-reference/main/db/sql-helper/prepare-update.md) вместе с SQL-фрагментом:

```php
$helper = $db->getSqlHelper();
[$update, $binds] = $helper->prepareUpdate('b_user', ['ACTIVE' => 'Y']);
$sql = 'UPDATE ' . $helper->quote('b_user') . ' SET ' . $update
    . ' WHERE ' . $helper->quote('ID') . ' = 1';

$db->queryExecute($sql, $binds);
```

В MySQL и PostgreSQL метод `prepareUpdate()` возвращает пустой массив привязок. Значения уже входят в SQL-фрагмент. Драйверы этих СУБД передают `$binds` в [SQL-трекер](sql-tracker.md), но не используют его для подстановки значений в запрос. Передавать значения для плейсхолдеров `?` или `:name` через этот параметр нельзя.

{% note warning "" %}

Параметр `$binds` не обеспечивает защиту от SQL-инъекций. Для значений, которые добавляете в SQL, используйте типизированные плейсхолдеры `SqlExpression` или экранирование через [`SqlHelper::forSql()`](../api-reference/main/db/sql-helper/for-sql.md). Подробнее — в статье [Формирование запросов](sql-helper-and-expression.md).

{% endnote %}

## Как выполнять INSERT-запросы

В комментариях к INSERT-примерам показан SQL для MySQL. Таблица `my_table` в этих примерах содержит строковые столбцы `NAME` и `CONTENT`.

Метод `add()` добавляет одну запись и возвращает ее идентификатор. Добавьте запись в таблицу `my_table`:

```php
$id = $db->add('my_table', [
    'NAME' => 'example',
    'CONTENT' => 'Про "базы" данных'
]);
// SQL: INSERT INTO `my_table`(`NAME`, `CONTENT`) VALUES ('example', 'Про \"базы\" данных')
```

Метод `addMulti()` добавляет несколько записей одним запросом `INSERT` и возвращает результат метода `getInsertedId()` после этого запроса. В MySQL это идентификатор первой добавленной записи. Добавьте две записи:

```php
$insertedId = $db->addMulti('my_table', [
    [
        'NAME' => 'example one',
        'CONTENT' => 'Первая статья'
    ],
    [
        'NAME' => 'example two',
        'CONTENT' => 'Вторая статья'
    ]
]);
// SQL: INSERT INTO `my_table` (`NAME`, `CONTENT`) VALUES ('example one', 'Первая статья'), ('example two', 'Вторая статья')
```

Методы `add()` и `addMulti()` преобразуют значения и проверяют существование столбцов в таблице. Если указанного столбца нет, метод исключает его из запроса:

```php
/**
 * Выполнится запрос:
 * INSERT INTO `my_table`(`NAME`) VALUES ('example')
 */
$insertedId = $db->add('my_table', [
    'NAME' => 'example',
    'NOT_EXISTS_COLUMN' => 'что я тут делаю?', // Этот столбец пропустят, так как его нет в таблице
]);
```

## Как обработать ошибку запроса {#query-errors}

Если СУБД возвращает ошибку, методы `query()`, `queryScalar()`, `queryExecute()`, `add()` и `addMulti()` выбрасывают исключение `\Bitrix\Main\DB\SqlQueryException`. Методы не возвращают `false` при ошибке, поэтому обрабатывайте ее в блоке `try`/`catch`.

Исключение `SqlQueryException` хранит сведения об ошибке:

-  `getMessage()` — сообщение вида `Mysql query error: текст ошибки` для MySQL или `Pgsql query error: текст ошибки` для PostgreSQL,

-  `getDatabaseMessage()` — текст ошибки СУБД без префикса, в MySQL он начинается с кода ошибки в скобках,

-  `getQuery()` — текст SQL-запроса, который вызвал ошибку, вместе с `LIMIT`, если его дописал метод.

Если запрос нарушает уникальный ключ, метод выбрасывает исключение `\Bitrix\Main\DB\DuplicateEntryException`. Это исключение возникает при коде ошибки `1062` в MySQL и `23505` в PostgreSQL. Класс `DuplicateEntryException` наследует `SqlQueryException`, поэтому перехватывайте его в первом блоке `catch`.

**Пример.** Код добавляет запись в таблицу `my_table`, пропускает повтор ключа и сохраняет текст ошибки и запрос для остальных ошибок:

```php
use Bitrix\Main\Application;
use Bitrix\Main\DB\DuplicateEntryException;
use Bitrix\Main\DB\SqlQueryException;

$db = Application::getConnection();

try
{
    $db->queryExecute("INSERT INTO my_table (ID, NAME) VALUES (1, 'draft')");
}
catch (DuplicateEntryException $e)
{
    // Запись с ID = 1 уже есть
}
catch (SqlQueryException $e)
{
    $errorText = $e->getDatabaseMessage();
    $failedSql = $e->getQuery();
}
```

Чтобы при ошибке отменить изменения всей группы запросов, выполняйте их в транзакции и вызывайте `rollbackTransaction()` в блоке `catch`. Порядок вызовов описан в статье [Транзакции](transactions.md).

## Методы работы с таблицами

Объект соединения предоставляет методы для создания таблиц, изменения их структуры и проверки существования.

### Создать новую таблицу

Метод `createTable()` создает таблицу, если ее еще нет, через `CREATE TABLE IF NOT EXISTS`. Структуру существующей таблицы метод не меняет. Параметры метода:

-  `$tableName` — имя создаваемой таблицы.

-  `$fields` — массив [ORM-полей](../orm/orm-concepts.md) таблицы в формате `'FIELD_NAME' => FieldObject`. Каждый объект должен наследовать `\Bitrix\Main\ORM\Fields\ScalarField`.

-  `$primary` — массив ключей из `$fields`, которые образуют первичный ключ. По умолчанию пустой массив.

-  `$autoincrement` — массив ключей из `$fields` для столбцов с автоинкрементом. По умолчанию пустой массив.

Передайте `['ID']` третьим и четвертым аргументами, чтобы создать первичный ключ и автоинкремент для столбца `ID`:

```php
$db->createTable('my_table', [
    'ID' => new \Bitrix\Main\ORM\Fields\IntegerField('ID'),
    'NAME' => new \Bitrix\Main\ORM\Fields\StringField('NAME', [
        'size' => 255,
    ]),
], ['ID'], ['ID']);
```

Метод берет первичный ключ и автоинкремент из аргументов `$primary` и `$autoincrement`. Параметры ORM-поля `primary` и `autocomplete` их не заменяют.

Метод создает поля без параметра `nullable => true` с ограничением `NOT NULL`. Значение по умолчанию из параметра ORM-поля `default_value` не попадает в `DEFAULT` колонки. При прямой вставке через SQL передавайте значения таких столбцов в запросе.

### Удалить существующую таблицу

Метод `dropTable()` удаляет таблицу по имени. Он выполняет `DROP TABLE` без `IF EXISTS` и выбрасывает исключение `\Bitrix\Main\DB\SqlQueryException`, если таблицы нет. Перед удалением проверьте ее существование методом `isTableExists()`:

```php
if ($db->isTableExists('my_table'))
{
    $db->dropTable('my_table');
}
```

### Создать индекс

Метод `createIndex()` создает индекс. Параметры метода:

-  `$tableName` — имя таблицы.

-  `$indexName` — имя создаваемого индекса.

-  `$columnNames` — массив имен столбцов для индекса.

-  `$columnLengths` — массив длин префиксов в формате `'COLUMN_NAME' => длина` для MySQL. По умолчанию `null` — индекс по полным значениям. PostgreSQL игнорирует этот параметр.

-  `$indexType` — тип индекса. По умолчанию `null` — обычный индекс. Для уникального индекса передайте [`\Bitrix\Main\DB\Connection::INDEX_UNIQUE`](../api-reference/main/db/connection/index.md).

Создайте уникальный индекс по столбцу `NAME`:

```php
$db->createIndex('my_table', 'idx_name', ['NAME'], null, \Bitrix\Main\DB\Connection::INDEX_UNIQUE);
```

### Создать первичный ключ для таблицы

Метод `createPrimaryIndex()` создает первичный ключ. Параметры метода:

-  `$tableName` — имя таблицы,

-  `$columnNames` — массив имен столбцов, входящих в первичный ключ.

Создайте первичный ключ по столбцу `ID`:

```php
$db->createPrimaryIndex('my_table', ['ID']);
```

### Удалить столбец из таблицы

Метод `dropColumn()` удаляет столбец. Параметры метода:

-  `$tableName` — имя таблицы,

-  `$columnName` — имя удаляемого столбца.

Удалите столбец `DESCRIPTION`:

```php
$db->dropColumn('my_table', 'DESCRIPTION');
```

### Переименовать таблицу

Метод `renameTable()` переименовывает таблицу. Параметры метода:

-  `$oldTableName` — текущее имя таблицы,

-  `$newTableName` — новое имя таблицы.

Переименуйте таблицу `old_table` в `new_table`:

```php
$db->renameTable('old_table', 'new_table');
```

### Очистить данные в таблице

Метод `truncateTable()` удаляет все строки таблицы командой `TRUNCATE TABLE`. Передайте в метод имя таблицы:

```php
$db->truncateTable('my_table');
```

### Проверить существование таблицы

Метод `isTableExists()` возвращает `true`, если таблица существует, и `false`, если ее нет:

```php
$db->isTableExists('my_table');
```

### Вернуть описание полей таблицы

Метод `getTableFields()` возвращает массив объектов ORM-полей с ключами по именам столбцов таблицы:

```php
$fields = $db->getTableFields('my_table');
```

## Как работать с результатами запросов

Метод `query()` возвращает объект [`\Bitrix\Main\DB\Result`](../api-reference/main/db/result/index.md). Объект отдает строки выборки по одной в виде ассоциативных массивов с именами столбцов в ключах.

Переберите результат в цикле `foreach`:

```php
$result = $db->query('SELECT `ID`, `NAME` FROM b_user');
foreach ($result as $row)
{
    $id = $row['ID'];
}
```

Читайте строки по одной методом `fetch()`. Метод возвращает `false`, когда строки закончились:

```php
$result = $db->query('SELECT `ID`, `NAME` FROM b_user');
while ($row = $result->fetch())
{
    $id = $row['ID'];
}
```

Получите все строки массивом методом `fetchAll()`. Метод возвращает пустой массив, если запрос не вернул строк:

```php
$rows = $db->query('SELECT `ID`, `NAME` FROM b_user')->fetchAll();
```

{% note warning "" %}

Объект `Result` читает строки только вперед. Повторный `foreach` по тому же объекту не вернет строк. Чтобы использовать строки несколько раз, сохраните их в массив методом `fetchAll()`.

{% endnote %}

### Разница между `fetch()` и `fetchRaw()`

Оба метода читают следующую строку результата и возвращают `false`, когда строки закончились. Методы отличаются обработкой значений:

-  `fetch()` — применяет к строке конвертеры столбцов и модификаторы выборки. По умолчанию конвертеры превращают значения столбцов типа `DATE` и `DATETIME` в объекты `\Bitrix\Main\Type\Date` и `\Bitrix\Main\Type\DateTime`. Значения других типов метод не меняет.

-  `fetchRaw()` — возвращает строку в том виде, в каком ее отдал драйвер СУБД.

**Пример.** Одна и та же строка, прочитанная двумя методами в двух запросах:

```php
$sql = 'SELECT `ID`, `ACTIVE`, `DATE_REGISTER` FROM b_user WHERE `ID` = 1';

// fetch() — дата преобразована в объект
$row = $db->query($sql)->fetch();
// [
//    'ID' => '1',
//    'ACTIVE' => 'Y',
//    'DATE_REGISTER' => Bitrix\Main\Type\DateTime Object
// ]

// fetchRaw() — значения в исходном виде
$rawRow = $db->query($sql)->fetchRaw();
// [
//    'ID' => '1',
//    'ACTIVE' => 'Y',
//    'DATE_REGISTER' => '2021-12-29 09:50:14'
// ]
```

### Дополнительные методы

Объект `Result` также возвращает сведения о выборке:

```php
// Количество выбранных строк
$count = $result->getSelectedRowsCount();

// Объект драйвера БД. Например, для MySQL это экземпляр класса mysqli_result
$resource = $result->getResource();

// Массив объектов ORM-полей с ключами по именам столбцов результата
$fields = $result->getFields();
```

## Конвертеры и модификаторы данных

Добавляйте свои конвертеры столбцов и модификаторы выборки, чтобы преобразовывать данные перед использованием.

**Конвертер столбца.** Конвертер преобразует значение одного столбца, например меняет формат даты. Задайте конвертеры методом `setConverters()`. В ключе массива передайте имя столбца, в значении — функцию, которая получает значение и возвращает новое:

```php
$resultIterator = \Bitrix\Main\Application::getConnection()->query(
    'SELECT ID, ACTIVE, DATE_REGISTER FROM b_user'
);

// Конвертер для столбца DATE_REGISTER (преобразует строку в timestamp)
$resultIterator->setConverters([
    'DATE_REGISTER' => static fn($value) => $value ? strtotime($value) : null,
]);
```

Метод `setConverters()` заменяет весь набор конвертеров результата, в том числе конвертеры дат по умолчанию. Конвертер получает значение столбца в исходном виде. Чтобы сохранить остальные конвертеры, объедините новый массив с результатом метода `getConverters()`.

**Модификатор выборки.** Модификатор получает каждую строку выборки целиком и может добавить в нее вычисляемые поля. Добавьте модификатор методом `addFetchDataModifier()`, например, чтобы вычислить поле `ACTIVE_BOOL` по полю `ACTIVE`:

```php
// Модификатор добавляет поле ACTIVE_BOOL (true/false на основе ACTIVE)
$resultIterator->addFetchDataModifier(static function(array $row) {
    $row['ACTIVE_BOOL'] = $row['ACTIVE'] === 'Y';
    return $row;
});
```

Метод `fetch()` вызывает модификаторы после конвертеров. Если модификатор возвращает массив, метод использует его как новую строку. Метод `addFetchDataModifier()` выбрасывает исключение `\Bitrix\Main\ArgumentException`, если аргумент нельзя вызвать как функцию.

**Пример.** Код выводит первую строку после конвертера и модификатора:

```php
foreach ($resultIterator as $row)
{
    /**
     * [ID] => 1
     * [ACTIVE] => Y
     * [DATE_REGISTER] => 1640771366
     * [ACTIVE_BOOL] => 1
     */
    print_r($row);
    break;
}
```

## Связанные материалы

-  [Конфигурация](configuration.md)
-  [Формирование запросов](sql-helper-and-expression.md)
-  [Транзакции](transactions.md)
-  [Отладка запросов](sql-tracker.md)
-  [Как писать код, совместимый с PostgreSQL](postgresql/compatible-code.md)
-  [Выборка данных ORM](../orm/querying-data.md)
-  [Построитель запросов ORM](../orm/query-builder.md)
