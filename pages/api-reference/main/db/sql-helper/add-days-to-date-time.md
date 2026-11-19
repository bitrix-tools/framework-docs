---
title: Прибавить дни к дате SqlHelper::addDaysToDateTime
description: Метод SqlHelper::addDaysToDateTime возвращает SQL-выражение, которое прибавляет дни к дате и времени.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::addDaysToDateTime` возвращает SQL-выражение, которое прибавляет число дней к дате и времени. Отрицательное число вычитает дни.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function addDaysToDateTime($days, $from = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| days\* | `int` | Задает число дней. Метод подставляет значение в SQL без экранирования, приведите его к целому числу заранее |
| from | `string`, `null` | Задает колонку или SQL-выражение с датой и временем. Метод подставляет значение в SQL без экранирования. По умолчанию — `null`, текущие дата и время |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `DATE_ADD(<from>, INTERVAL <days> DAY)`. Без `from` — `NOW()` |
| `PgsqlSqlHelper` | `(<from>::timestamp + cast(<days>\|\|' day' as interval))`. Без `from` — `now()` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код считает пользователей, которые зарегистрировались за последние 30 дней:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT COUNT(*) FROM ' . $helper->quote(UserTable::getTableName())
    . ' WHERE DATE_REGISTER > ' . $helper->addDaysToDateTime(-30)
);
```

## Смотрите также

- [SqlHelper::addSecondsToDateTime](add-seconds-to-date-time.md)
