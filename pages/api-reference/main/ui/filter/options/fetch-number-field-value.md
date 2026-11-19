---
title: Получить значения числового поля Options::fetchNumberFieldValue
description: Статический метод Options::fetchNumberFieldValue возвращает тип сравнения и границы числового поля из значений пресета.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::fetchNumberFieldValue` возвращает тип сравнения и границы числового поля — ключи `_numsel`, `_from` и `_to`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function fetchNumberFieldValue($key = "", $filterFields = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| key | `string` | Задает ключ типа сравнения, например `WEIGHT_numsel`. По умолчанию — пустая строка |
| filterFields | `array` | Задает значения полей пресета. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив значений поля. Если обе границы — пустые строки, метод возвращает пустой массив.

Тип сравнения задают константы `Bitrix\Main\UI\Filter\NumberType` — `SINGLE` (`exact`), `RANGE` (`range`), `MORE` (`more`), `LESS` (`less`).

## Примеры

**Пример.** Код получает диапазон и пустое поле:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$range = Options::fetchNumberFieldValue('WEIGHT_numsel', ['WEIGHT_numsel' => 'range', 'WEIGHT_from' => '1', 'WEIGHT_to' => '5']);
$empty = Options::fetchNumberFieldValue('WEIGHT_numsel', ['WEIGHT_numsel' => 'range', 'WEIGHT_from' => '', 'WEIGHT_to' => '']);

echo json_encode($range) . ' ' . json_encode($empty);
```

Код выведет `{"WEIGHT_numsel":"range","WEIGHT_from":"1","WEIGHT_to":"5"} []`.

## Смотрите также

- [Options::isNumberField](is-number-field.md)
