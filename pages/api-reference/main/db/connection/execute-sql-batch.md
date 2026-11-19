---
title: Выполнить пакет запросов Connection::executeSqlBatch
description: Метод Connection::executeSqlBatch разбивает текст на запросы, выполняет их по очереди и возвращает тексты ошибок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::executeSqlBatch` разбивает текст на отдельные запросы через [parseSqlBatch](parse-sql-batch.md) и выполняет их по очереди. Метод не выбрасывает исключения при ошибках запросов, а собирает тексты ошибок в массив. Аналог в классическом API — `CDatabase::RunSQLBatch`, он читает запросы из файла.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function executeSqlBatch($sqlBatch, $stopOnError = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sqlBatch\* | `string` | Задает текст с несколькими запросами. Правила разбиения — на странице [parseSqlBatch](parse-sql-batch.md) |
| stopOnError | `bool` | Останавливает выполнение после первой ошибки, если равен `true`. По умолчанию — `false`, метод выполняет все запросы |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает массив `array` с текстами ошибок в порядке выполнения запросов. Пустой массив означает, что все запросы выполнились без ошибок.

Метод собирает только исключения `Bitrix\Main\DB\SqlException` и его наследников. Метод не открывает транзакцию. Запросы, которые выполнились до ошибки, остаются в базе данных.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код выполняет три запроса. Второй запрос ошибочный, третий все равно выполняется:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$batch = 'CREATE TABLE demo_api_batch (ID INT NOT NULL);
INSERT INTO demo_api_batch (MISSING_COLUMN) VALUES (1);
INSERT INTO demo_api_batch (ID) VALUES (2);';

try
{
    $errors = $connection->executeSqlBatch($batch);

    echo count($errors) . ' error(s), rows: ' . $connection->queryScalar('SELECT COUNT(*) FROM demo_api_batch');
}
finally
{
    if ($connection->isTableExists('demo_api_batch'))
    {
        $connection->dropTable('demo_api_batch');
    }
}
```

## Смотрите также

- [Connection::parseSqlBatch](parse-sql-batch.md)
- [Connection::queryExecute](query-execute.md)
