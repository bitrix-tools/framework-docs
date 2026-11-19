---
title: Получить значения полей из настроек пресета Options::fetchFieldValuesFromFilterSettings
description: Статический метод Options::fetchFieldValuesFromFilterSettings получает значения полей из настроек пресета и вычисляет границы дат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::fetchFieldValuesFromFilterSettings` получает значения полей из настроек пресета. [getFilter](get-filter.md) вызывает его для текущего пресета. Метод нужен, чтобы получить значения пресета, который не применен.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function fetchFieldValuesFromFilterSettings($filterSettings = [], $additionalFields = [], $sourceFields = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| filterSettings | `array` | Задает настройки пресета с ключом `fields`. По умолчанию — пустой массив |
| additionalFields | `array` | Задает дополнительные поля. Метод добавляет их к значениям. По умолчанию — пустой массив |
| sourceFields | `array` | Задает описание полей фильтра. На результат параметр не влияет. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив значений.

- Метод пропускает пустые значения.
- Для поля даты метод вычисляет границы `_from` и `_to` методом [fetchDateFieldValue](fetch-date-field-value.md).
- Для числового поля метод берет `_numsel`, `_from` и `_to` методом [fetchNumberFieldValue](fetch-number-field-value.md).
- Метод превращает ключ `<поле>_isEmpty` в `<поле>` = `false`, а ключ `<поле>_hasAnyValue` — в `!<поле>` = `false`.

## Примеры

**Пример.** Код получает значения из настроек пресета:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$values = Options::fetchFieldValuesFromFilterSettings(
    ['fields' => ['NAME' => 'kg', 'ACTIVE' => '', 'WEIGHT_numsel' => 'range', 'WEIGHT_from' => '1', 'WEIGHT_to' => '5', 'SKU_isEmpty' => 'y']],
    ['COLOR' => 'red']
);

echo json_encode($values);
```

Код выведет `{"NAME":"kg","WEIGHT_numsel":"range","WEIGHT_from":"1","WEIGHT_to":"5","SKU":false,"COLOR":"red"}`.

## Смотрите также

- [Options::getFilter](get-filter.md)
