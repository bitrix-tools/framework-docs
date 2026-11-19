---
title: Прибавить секунды к дате SqlHelper::addSecondsToDateTime
description: Метод SqlHelper::addSecondsToDateTime возвращает SQL-выражение, которое прибавляет секунды к дате и времени.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `SqlHelper::addSecondsToDateTime` возвращает SQL-выражение, которое прибавляет число секунд к дате и времени. Отрицательное число вычитает секунды.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function addSecondsToDateTime($seconds, $from = null);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| seconds\* | `int` | Задает число секунд. Метод подставляет значение в SQL без экранирования, приведите его к целому числу заранее |
| from | `string`, `null` | Задает колонку или SQL-выражение с датой и временем. Метод подставляет значение в SQL без экранирования. По умолчанию — `null`, текущие дата и время |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `DATE_ADD(<from>, INTERVAL <seconds> SECOND)`. Без `from` — `NOW()` |
| `PgsqlSqlHelper` | `<from>::timestamp + cast(<seconds>\|\|' second' as interval)`. Без `from` — `now()` |

## Примеры

**Пример.** Код считает пользователей, которые входили на сайт за последний час:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT COUNT(*) FROM ' . $helper->quote(UserTable::getTableName())
    . ' WHERE LAST_LOGIN > ' . $helper->addSecondsToDateTime(-3600)
);
```

## Смотрите также

- [SqlHelper::addDaysToDateTime](add-days-to-date-time.md)
- [SqlHelper::getCurrentDateTimeFunction](get-current-date-time-function.md)
