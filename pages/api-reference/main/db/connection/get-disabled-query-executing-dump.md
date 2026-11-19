---
title: Получить собранные запросы Connection::getDisabledQueryExecutingDump
description: Метод Connection::getDisabledQueryExecutingDump возвращает запросы, собранные при отключенном выполнении, и очищает список.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Connection::getDisabledQueryExecutingDump` возвращает тексты запросов, которые соединение собрало после [disableQueryExecuting](disable-query-executing.md), и очищает список.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getDisabledQueryExecutingDump()
```

## Возвращаемое значение

Метод возвращает массив строк `string[]` в порядке вызова [query](query.md). Если соединение не собрало ни одного запроса, метод возвращает `null`.

Если код вызвал `query` с ограничением по числу строк, текст в списке уже содержит это ограничение.

После вызова список пуст. Следующий вызов вернет `null`, пока соединение не соберет новые запросы.

## Примеры

**Пример.** Код собирает два запроса и выводит их:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->disableQueryExecuting();
try
{
    $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'new')");
    $connection->queryExecute("UPDATE demo_api_status SET STATUS = 'done' WHERE ID = 1");
}
finally
{
    $connection->enableQueryExecuting();
}

foreach ($connection->getDisabledQueryExecutingDump() ?? [] as $sql)
{
    echo $sql . PHP_EOL;
}
```

## Смотрите также

- [Connection::disableQueryExecuting](disable-query-executing.md)
- [Connection::enableQueryExecuting](enable-query-executing.md)
