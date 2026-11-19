---
title: Преобразовать дату для SQL SqlHelper::convertToDbDate
description: Метод SqlHelper::convertToDbDate превращает объект Bitrix\Main\Type\Date в литерал даты SQL.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToDbDate` превращает объект даты в литерал даты SQL без времени.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDbDate($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `Bitrix\Main\Type\Date`, `null` | Задает дату. Объект `DateTime` тоже подходит, время метод отбрасывает |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string`. Для пустого значения — `NULL`. Для объекта — результат [getCharToDateFunction](get-char-to-date-function.md) с датой в формате `Y-m-d`, например `'2024-01-01'` в MySQL и `timestamp '2024-01-01'` в PostgreSQL.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Код передал непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код готовит дату для условия запроса:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

echo 'DATE_REGISTER >= ' . $helper->convertToDbDate(new Date('2024-01-01', 'Y-m-d'));
```

## Смотрите также

- [SqlHelper::convertToDbDateTime](convert-to-db-date-time.md)
- [SqlHelper::convertFromDbDate](convert-from-db-date.md)
