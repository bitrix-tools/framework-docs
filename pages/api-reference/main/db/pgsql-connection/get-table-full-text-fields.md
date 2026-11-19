---
title: Получить колонки полнотекстового индекса PgsqlConnection::getTableFullTextFields
description: Метод PgsqlConnection::getTableFullTextFields возвращает колонки таблицы, по которым построен полнотекстовый индекс.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PgsqlConnection::getTableFullTextFields` возвращает колонки таблицы, которые входят в выражения ее индексов. Такое выражение есть у полнотекстового индекса, который создает [createIndex](../connection/create-index.md) с типом `INDEX_FULLTEXT`. Метод [getTableFields](../connection/get-table-fields.md) вызывает `getTableFullTextFields`, чтобы отметить такие строковые поля признаком полнотекстового индекса.

Сигнатура метода в классе `Bitrix\Main\DB\PgsqlConnection`:

```php
public function getTableFullTextFields($tableName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Метод приводит имя к нижнему регистру |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив `имя колонки => true` и приводит имена колонок к верхнему регистру. Метод разбирает выражения всех индексов таблицы и не проверяет тип индекса. Таблицу метод ищет по имени во всех схемах.

Если полнотекстовых индексов нет или таблицы нет, метод возвращает пустой массив.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код создает полнотекстовый индекс по колонке `TITLE` и выводит колонки полнотекстовых индексов таблицы. Пример работает только на PostgreSQL:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\Connection;
use Bitrix\Main\DB\PgsqlConnection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
if (!$connection instanceof PgsqlConnection)
{
    exit('PostgreSQL connection is required');
}

$connection->queryExecute('CREATE TABLE demo_api_notes (ID INT NOT NULL, TITLE VARCHAR(255))');

try
{
    $connection->createIndex('demo_api_notes', 'ix_demo_api_notes_title', ['TITLE'], null, Connection::INDEX_FULLTEXT);
    print_r($connection->getTableFullTextFields('demo_api_notes'));
}
finally
{
    $connection->dropTable('demo_api_notes');
}
```

## Смотрите также

- [Connection::getTableFields](../connection/get-table-fields.md)
- [Connection::createIndex](../connection/create-index.md)
