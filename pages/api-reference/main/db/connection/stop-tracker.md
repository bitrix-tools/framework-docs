---
title: Выключить отслеживание запросов Connection::stopTracker
description: Метод Connection::stopTracker выключает сбор сведений о запросах и не удаляет собранные сведения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::stopTracker` выключает сбор сведений о запросах, который включил [startTracker](start-tracker.md). Объект `SqlTracker` и собранные сведения остаются, их возвращает [getTracker](get-tracker.md).

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function stopTracker()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код отслеживает только один запрос. Второй запрос выполняется после `stopTracker` и в сведения не попадает:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$tracker = $connection->startTracker(true);

$connection->queryScalar('SELECT COUNT(*) FROM ' . UserTable::getTableName());
$connection->stopTracker();
$connection->queryScalar('SELECT MAX(ID) FROM ' . UserTable::getTableName());

echo $tracker->getCounter();
```

Код выведет `1`.

## Смотрите также

- [Connection::startTracker](start-tracker.md)
- [Connection::getTracker](get-tracker.md)
