---
title: Превратить строку в дату SqlHelper::getCharToDateFunction
description: Метод SqlHelper::getCharToDateFunction возвращает SQL-выражение даты и времени из строки в формате YYYY-MM-DD HH:MI:SS.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `SqlHelper::getCharToDateFunction` возвращает SQL-выражение даты и времени из строки. Методы [convertToDbDate](convert-to-db-date.md) и [convertToDbDateTime](convert-to-db-date-time.md) используют его для объектов дат. Метод классического API `CDatabase::CharToDateFunction` с похожим именем работает иначе и принимает дату в формате сайта.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getCharToDateFunction($value);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает дату в формате `YYYY-MM-DD HH:MI:SS` или `YYYY-MM-DD`. Метод подставляет значение в SQL без экранирования |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `'<value>'` |
| `PgsqlSqlHelper` | `timestamp '<value>'` |

## Примеры

**Пример.** Код строит условие по дате из объекта `DateTime`:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();
$from = new DateTime('2024-01-01 00:00:00', 'Y-m-d H:i:s');

echo 'DATE_REGISTER >= ' . $helper->getCharToDateFunction($from->format('Y-m-d H:i:s'));
```

Для MySQL код выведет `DATE_REGISTER >= '2024-01-01 00:00:00'`.

## Смотрите также

- [SqlHelper::getDateToCharFunction](get-date-to-char-function.md)
- [SqlHelper::convertToDbDateTime](convert-to-db-date-time.md)
