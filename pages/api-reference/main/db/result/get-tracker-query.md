---
title: Получить сведения о запросе Result::getTrackerQuery
description: Метод Result::getTrackerQuery возвращает объект SqlTrackerQuery со сведениями о запросе, если код включил отслеживание.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Result::getTrackerQuery` возвращает сведения о запросе, который создал этот результат. Сведения есть, только если перед запросом код включил отслеживание через [Connection::startTracker](../connection/start-tracker.md).

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function getTrackerQuery()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Diag\SqlTrackerQuery` или `null`, если код не включил отслеживание.

Методы [fetchRaw](fetch-raw.md), [fetch](fetch.md) и [fetchAll](fetch-all.md) дополняют сведения временем выборки, числом и размером прочитанных строк.

## Примеры

**Пример.** Код включает отслеживание, выполняет запрос, читает строки и выводит время запроса вместе с выборкой:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$connection->startTracker(true);

try
{
    $result = $connection->query('SELECT ID, LOGIN FROM ' . UserTable::getTableName(), 3);
    $rows = $result->fetchAll();
}
finally
{
    $connection->stopTracker();
}

$trackerQuery = $result->getTrackerQuery();
echo count($rows) . ' rows, ' . round($trackerQuery->getTime(), 4) . ' s';
```

## Смотрите также

- [Connection::startTracker](../connection/start-tracker.md)
