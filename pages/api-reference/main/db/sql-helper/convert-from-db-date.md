---
title: Преобразовать дату из базы данных SqlHelper::convertFromDbDate
description: Метод SqlHelper::convertFromDbDate превращает дату из базы данных в объект Bitrix\Main\Type\Date.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertFromDbDate` превращает дату из базы данных в объект `Bitrix\Main\Type\Date`. Метод [Result::fetch](../result/fetch.md) вызывает его для колонок типа даты.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertFromDbDate($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string`, `null` | Задает дату из базы данных |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Type\Date` или `null`.

| Реализация | Результат |
| --- | --- |
| `SqlHelper` | Объект `Date`, созданный из строки в формате сайта. Для `null` — объект с текущей датой |
| `MysqliSqlHelper`, `PgsqlSqlHelper` | Объект `Date` из строки формата `Y-m-d`. Для `null` и `0000-00-00` — `null` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ObjectException` | Строку не удалось разобрать как дату |

## Примеры

**Пример.** Код превращает строку из базы данных в объект даты:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$date = Application::getConnection()->getSqlHelper()->convertFromDbDate('2024-01-01');

echo $date->format('d.m.Y');
```

## Смотрите также

- [SqlHelper::convertToDbDate](convert-to-db-date.md)
- [SqlHelper::getConverter](get-converter.md)
