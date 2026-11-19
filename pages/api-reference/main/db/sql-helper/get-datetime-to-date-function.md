---
title: Отбросить время у даты SqlHelper::getDatetimeToDateFunction
description: Метод SqlHelper::getDatetimeToDateFunction возвращает SQL-выражение, которое приводит дату и время к дате без времени.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getDatetimeToDateFunction` возвращает SQL-выражение, которое приводит дату и время к дате без времени. Аналог в классическом API — `CDatabase::DatetimeToDateFunction`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getDatetimeToDateFunction($value);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает колонку или SQL-выражение. Метод подставляет значение в SQL без экранирования |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `DATE(<value>)` |
| `PgsqlSqlHelper` | `cast(<value> as date)` |

## Примеры

**Пример.** Код выводит выражение для колонки даты регистрации:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

echo $helper->getDatetimeToDateFunction($helper->quote('DATE_REGISTER'));
```

Для MySQL код выведет ``DATE(`DATE_REGISTER`)``.

## Смотрите также

- [SqlHelper::getCurrentDateFunction](get-current-date-function.md)
- [SqlHelper::formatDate](format-date.md)
