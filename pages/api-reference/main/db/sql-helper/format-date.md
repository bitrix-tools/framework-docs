---
title: Отформатировать дату в SQL SqlHelper::formatDate
description: Метод SqlHelper::formatDate переводит формат даты Битрикс в формат базы данных и строит выражение форматирования колонки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `SqlHelper::formatDate` переводит формат даты Битрикс, например `DD.MM.YYYY HH:MI:SS`, в формат функции базы данных. Если код передает колонку в `field`, метод возвращает выражение, которое форматирует ее значение.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function formatDate($format, $field = null);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| format\* | `string` | Задает формат из обозначений в таблице ниже. Остальные символы метод оставляет как есть |
| field | `string`, `null` | Задает колонку или SQL-выражение с датой. Метод подставляет значение в SQL без экранирования. По умолчанию — `null`, метод возвращает только формат |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

| Обозначение | MySQL | PostgreSQL |
| --- | --- | --- |
| `YYYY` | `%Y` | `YYYY` |
| `MMMM` | `%M` | `FMMonth` |
| `MM` | `%m` | `MM` |
| `M` | `%b`, если в формате нет `MMMM` | `Mon` |
| `DD` | `%d` | `DD` |
| `HH` | `%H` | `HH24` |
| `H` | `%h`, если в формате нет `HH` | `HH12` |
| `GG` | `%h` | `HH12` |
| `G` | `%l` | `FMHH12` |
| `MI` | `%i` | `MI` |
| `SS` | `%s` | `SS` |
| `TT`, `T` | `%p` | `PM` |
| `W` | `%w` | `D` |

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Без `field` | С `field` |
| --- | --- | --- |
| `MysqliSqlHelper` | Формат для `DATE_FORMAT` | `DATE_FORMAT(<field>, '<формат>')` |
| `PgsqlSqlHelper` | Формат для `to_char` | `to_char(<field>, '<формат>')` |

Формат внутри выражения метод экранирует через [forSql](for-sql.md).

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Код передал `field`, и подключиться к базе данных для экранирования не удалось |

## Примеры

**Пример.** Код выводит дату регистрации пользователей в формате `DD.MM.YYYY`:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$result = $connection->query(
    'SELECT LOGIN, ' . $helper->formatDate('DD.MM.YYYY', 'DATE_REGISTER') . ' AS REGISTERED'
    . ' FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID',
    3
);

while ($row = $result->fetch())
{
    echo $row['LOGIN'] . ' ' . $row['REGISTERED'] . PHP_EOL;
}
```

## Смотрите также

- [SqlHelper::getDateToCharFunction](get-date-to-char-function.md)
- [SqlHelper::getDatetimeToDateFunction](get-datetime-to-date-function.md)
