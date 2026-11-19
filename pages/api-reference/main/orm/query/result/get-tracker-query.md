---
title: Получить сведения для отслеживания Result::getTrackerQuery
description: Метод ORM\Query\Result::getTrackerQuery возвращает сведения о SQL-запросе, если включено отслеживание запросов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getTrackerQuery` возвращает сведения о SQL-запросе для отслеживания. Сведения включают текст, время выполнения и место вызова. Метод вызывает [DB\Result::getTrackerQuery](../../../db/result/get-tracker-query.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getTrackerQuery()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Diag\SqlTrackerQuery` или `null`, если отслеживание запросов не включено.

## Примеры

**Пример.** Код включает отслеживание и читает текст запроса:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$connection->startTracker();

$result = LanguageTable::getList(['select' => ['LID'], 'limit' => 1]);
$tracked = $result->getTrackerQuery();

$connection->stopTracker();

echo str_starts_with(ltrim($tracked->getSql()), 'SELECT') ? 'tracked select' : 'other';
```

Код выведет `tracked select`.

## Смотрите также

- [DB\Result::getTrackerQuery](../../../db/result/get-tracker-query.md)
