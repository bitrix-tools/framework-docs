---
title: Включить отслеживание запросов Connection::startTracker
description: Метод Connection::startTracker включает сбор сведений о запросах соединения и возвращает объект SqlTracker.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::startTracker` включает сбор сведений о запросах, которые выполняет метод [query](query.md). Объект `Bitrix\Main\Diag\SqlTracker` собирает по каждому запросу текст, параметр `binds`, идентификатор узла, время выполнения вместе с выборкой строк, число выбранных строк и стек вызовов. Глубину стека задает ключ `depth_back_trace` секции `exception_handling` в `.settings.php`, по умолчанию — 10 уровней. Запросы с ошибкой тоже попадают в сведения.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function startTracker($reset = false)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| reset | `bool` | Очищает собранные ранее сведения, если равен `true`. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Diag\SqlTracker`. Если у соединения еще нет объекта, метод создает его. Иначе возвращает тот же объект, который задал [setTracker](set-tracker.md) или метод создал раньше.

Сбор действует до вызова [stopTracker](stop-tracker.md).

## Примеры

**Пример.** Код собирает сведения о двух запросах и выводит их число и общее время:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$tracker = $connection->startTracker(true);

try
{
    $connection->queryScalar('SELECT COUNT(*) FROM ' . UserTable::getTableName());
    $connection->queryScalar('SELECT MAX(ID) FROM ' . UserTable::getTableName());
}
finally
{
    $connection->stopTracker();
}

echo $tracker->getCounter() . ' queries, ' . round($tracker->getTime(), 4) . ' s' . PHP_EOL;

foreach ($tracker->getQueries() as $query)
{
    echo $query->getSql() . PHP_EOL;
}
```

## Смотрите также

- [Connection::stopTracker](stop-tracker.md)
- [Connection::getTracker](get-tracker.md)
- [Connection::setTracker](set-tracker.md)
