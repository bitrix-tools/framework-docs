---
title: Вычислить границы поля даты Options::fetchDateFieldValue
description: Статический метод Options::fetchDateFieldValue вычисляет границы периода поля даты по типу периода.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::fetchDateFieldValue` вычисляет границы периода поля даты. Метод вызывает [calcDates](calc-dates.md) и возвращает ключи `_datesel`, `_from`, `_to` и связанные с ними.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function fetchDateFieldValue($key = "", $filterFields = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| key | `string` | Задает ключ типа периода, например `CREATED_datesel`. По умолчанию — пустая строка |
| filterFields | `array` | Задает значения полей пресета. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив значений поля. Если границы вычислить нельзя, метод убирает ключи `_datesel`, `_from` и `_to`.

## Примеры

**Пример.** Код вычисляет границы точной даты:

```php
<?php
use Bitrix\Main\UI\Filter\DateType;
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$date = Options::fetchDateFieldValue('CREATED_datesel', [
    'CREATED_datesel' => DateType::EXACT,
    'CREATED_from' => '15.01.2026',
]);

echo $date['CREATED_from'] . ' - ' . $date['CREATED_to'];
```

Код выведет `15.01.2026 00:00:00 - 15.01.2026 23:59:59`. Формат даты зависит от сайта.

## Смотрите также

- [Options::calcDates](calc-dates.md)
- [Options::isDateField](is-date-field.md)
