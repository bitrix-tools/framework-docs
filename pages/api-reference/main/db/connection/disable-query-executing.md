---
title: Отключить выполнение запросов Connection::disableQueryExecuting
description: Метод Connection::disableQueryExecuting отключает выполнение запросов. Метод query сохраняет текст запросов вместо выполнения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Connection::disableQueryExecuting` отключает выполнение запросов на соединении. После вызова метод [query](query.md) не обращается к базе данных, а сохраняет текст запроса в список. Метод [getDisabledQueryExecutingDump](get-disabled-query-executing-dump.md) возвращает этот список.

Так собирают SQL, который построил другой код, например миграция, и не меняют базу данных.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function disableQueryExecuting()
```

## Возвращаемое значение

Метод ничего не возвращает.

Режим действует для объекта соединения до вызова [enableQueryExecuting](enable-query-executing.md). Режим влияет на `query` и методы, которые вызывают `query`, например `queryExecute`.

В этом режиме `query` возвращает объект результата без данных. Методы, которые читают строки из результата, завершаются ошибкой PHP `\Error`. Это `fetch`, [queryScalar](query-scalar.md) и в PostgreSQL методы [getTableFields](get-table-fields.md), [add](add.md) и [addMulti](add-multi.md). В MySQL метод `getTableFields` выполняет запрос в обход `query` и в этом режиме тоже обращается к базе данных.

## Примеры

**Пример.** Код собирает текст запроса вместо выполнения. Блок `finally` снова включает выполнение запросов, даже если код между вызовами выбросит исключение:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->disableQueryExecuting();
try
{
    $connection->queryExecute("UPDATE demo_api_status SET STATUS = 'done' WHERE ID = 1");
}
finally
{
    $connection->enableQueryExecuting();
}

print_r($connection->getDisabledQueryExecutingDump());
```

## Смотрите также

- [Connection::enableQueryExecuting](enable-query-executing.md)
- [Connection::getDisabledQueryExecutingDump](get-disabled-query-executing-dump.md)
- [Connection::isQueryExecutingEnabled](is-query-executing-enabled.md)
