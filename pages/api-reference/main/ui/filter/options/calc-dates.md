---
title: Вычислить границы периода Options::calcDates
description: Статический метод Options::calcDates вычисляет границы периода даты по типу из DateType — вчера, текущий месяц, квартал, год, диапазон.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::calcDates` вычисляет границы периода по типу из ключа `<поле>_datesel` и пишет их в массив `result`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function calcDates($fieldId, $source, &$result)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fieldId\* | `string` | Задает код поля без суффикса, например `CREATED` |
| source\* | `array` | Задает значения поля — ключ `<поле>_datesel` и ключи, которые нужны типу |
| result\* | `array` | Принимает результат по ссылке |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

Тип периода задают константы `Bitrix\Main\UI\Filter\DateType` и `AdditionalDateType`.

| Тип | Что нужно в `source` |
| --- | --- |
| `YESTERDAY`, `CURRENT_DAY`, `TOMORROW`, `CURRENT_WEEK`, `NEXT_WEEK`, `LAST_WEEK`, `CURRENT_MONTH`, `NEXT_MONTH`, `LAST_MONTH`, `CURRENT_QUARTER`, `LAST_7_DAYS`, `LAST_30_DAYS`, `LAST_60_DAYS`, `LAST_90_DAYS` | Ничего |
| `MONTH` | `<поле>_month`, `<поле>_year` |
| `QUARTER` | `<поле>_quarter`, `<поле>_year` |
| `YEAR` | `<поле>_year` |
| `PREV_DAYS`, `NEXT_DAYS`, `PREV_DAY`, `NEXT_DAY`, `AFTER_DAYS`, `MORE_THAN_DAYS_AGO` | `<поле>_days` |
| `EXACT` | `<поле>_from` |
| `RANGE` | `<поле>_from` и `<поле>_to` |

## Возвращаемое значение

Метод ничего не возвращает. Метод пишет результат в `result` — ключи `<поле>_from`, `<поле>_to` и для части типов `<поле>_month`, `<поле>_quarter`, `<поле>_year`, `<поле>_days`.

## Особенности

- Ключ `<поле>_datesel` метод пишет для типов из `DateType`. Для типов из `AdditionalDateType` метод его не пишет.
- Для `CURRENT_QUARTER` метод пишет в `<поле>_datesel` значение `QUARTER`.

## Примеры

**Пример.** Код вычисляет границы второго квартала:

```php
<?php
use Bitrix\Main\UI\Filter\DateType;
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = [];
Options::calcDates('CREATED', [
    'CREATED_datesel' => DateType::QUARTER,
    'CREATED_quarter' => '2',
    'CREATED_year' => '2026',
], $result);

echo $result['CREATED_from'] . ' - ' . $result['CREATED_to'];
```

Код выведет `01.04.2026 00:00:00 - 30.06.2026 23:59:59`. Формат даты зависит от сайта.

## Смотрите также

- [Options::fetchDateFieldValue](fetch-date-field-value.md)
