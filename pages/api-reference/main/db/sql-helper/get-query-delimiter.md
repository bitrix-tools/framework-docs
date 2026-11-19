---
title: Получить разделитель запросов SqlHelper::getQueryDelimiter
description: Метод SqlHelper::getQueryDelimiter возвращает символ, который разделяет запросы в тексте с несколькими запросами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getQueryDelimiter` возвращает символ, который разделяет запросы в тексте с несколькими запросами. Метод [Connection::parseSqlBatch](../connection/parse-sql-batch.md) разбивает текст по этому символу.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getQueryDelimiter();
```

## Возвращаемое значение

Метод возвращает строку `string`. В `MysqliSqlHelper` и `PgsqlSqlHelper` — точка с запятой.

## Примеры

**Пример.** Код склеивает запросы через разделитель базы данных:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$delimiter = Application::getConnection()->getSqlHelper()->getQueryDelimiter();

echo implode($delimiter . PHP_EOL, ['SELECT 1', 'SELECT 2']) . $delimiter;
```

## Смотрите также

- [Connection::parseSqlBatch](../connection/parse-sql-batch.md)
