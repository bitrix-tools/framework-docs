---
title: Проверить выполнение запросов Connection::isQueryExecutingEnabled
description: Метод Connection::isQueryExecutingEnabled проверяет, выполняет ли соединение запросы или только собирает их текст.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::isQueryExecutingEnabled` проверяет, выполняет ли соединение запросы. Метод [disableQueryExecuting](disable-query-executing.md) отключает выполнение, метод [enableQueryExecuting](enable-query-executing.md) снова включает его.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function isQueryExecutingEnabled()
```

## Возвращаемое значение

Метод возвращает `true`, если соединение выполняет запросы, и `false`, если только собирает их текст. Для нового объекта соединения метод возвращает `true`.

## Примеры

**Пример.** Код запоминает режим перед отключением и восстанавливает его в блоке `finally`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$wasEnabled = $connection->isQueryExecutingEnabled();

$connection->disableQueryExecuting();
try
{
    $connection->queryExecute('DELETE FROM demo_api_status WHERE ID = 1');
}
finally
{
    if ($wasEnabled)
    {
        $connection->enableQueryExecuting();
    }
}

print_r($connection->getDisabledQueryExecutingDump());
```

## Смотрите также

- [Connection::disableQueryExecuting](disable-query-executing.md)
- [Connection::enableQueryExecuting](enable-query-executing.md)
