---
title: Задать объект отслеживания Connection::setTracker
description: Метод Connection::setTracker задает объект SqlTracker, в который соединение собирает сведения о запросах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.9.4

{% endnote %}

Метод `Connection::setTracker` задает объект `Bitrix\Main\Diag\SqlTracker` для сведений о запросах. Так несколько соединений собирают сведения в один объект. Метод не включает сбор. Чтобы включить сбор, вызовите [startTracker](start-tracker.md).

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function setTracker(?Diag\SqlTracker $sqlTracker = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| sqlTracker | `Bitrix\Main\Diag\SqlTracker`, `null` | Задает объект отслеживания. По умолчанию — `null`, метод убирает объект у соединения |

## Возвращаемое значение

Метод ничего не возвращает.

Не передавайте `null`, пока сбор включен. Метод [query](query.md) обращается к объекту отслеживания при каждом запросе и завершится ошибкой PHP. Сначала вызовите [stopTracker](stop-tracker.md).

## Примеры

**Пример.** Код передает соединению свой объект отслеживания и затем включает сбор:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Diag\SqlTracker;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$tracker = new SqlTracker();

$connection->setTracker($tracker);
$connection->startTracker();

try
{
    $connection->queryScalar('SELECT COUNT(*) FROM ' . UserTable::getTableName());
}
finally
{
    $connection->stopTracker();
}

echo $tracker->getCounter();
```

## Смотрите также

- [Connection::startTracker](start-tracker.md)
- [Connection::getTracker](get-tracker.md)
