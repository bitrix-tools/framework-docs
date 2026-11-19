---
title: Включить выполнение запросов Connection::enableQueryExecuting
description: Метод Connection::enableQueryExecuting снова включает выполнение запросов после disableQueryExecuting.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Connection::enableQueryExecuting` снова включает выполнение запросов на соединении после [disableQueryExecuting](disable-query-executing.md). Метод не выполняет и не удаляет собранные запросы. Метод [getDisabledQueryExecutingDump](get-disabled-query-executing-dump.md) возвращает их.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function enableQueryExecuting()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код отключает выполнение запросов на время сбора SQL и снова включает его в блоке `finally`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->disableQueryExecuting();
try
{
    $connection->queryExecute('DELETE FROM demo_api_status WHERE ID = 1');
}
finally
{
    $connection->enableQueryExecuting();
}

var_dump($connection->isQueryExecutingEnabled());
```

## Смотрите также

- [Connection::disableQueryExecuting](disable-query-executing.md)
