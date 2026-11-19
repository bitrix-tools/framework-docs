---
title: Получить коды полей из значений Options::getRowsFromFields
description: Статический метод Options::getRowsFromFields получает коды полей из ключей значений фильтра и убирает служебные суффиксы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::getRowsFromFields` получает коды полей из ключей значений фильтра. Метод убирает служебные суффиксы, например `_from`, `_to`, `_datesel` и `_numsel`, поэтому ключи `WEIGHT_from` и `WEIGHT_to` дают одно поле `WEIGHT`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function getRowsFromFields($fields = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| fields | `array` | Задает значения — массив `ключ => значение`. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив кодов полей без повторов. Ключи массива идут с пропусками.

## Особенности

Метод убирает суффиксы в любом месте ключа и учитывает регистр. Суффиксы строчные, поэтому коды в верхнем регистре не меняются. Код в нижнем регистре, например `item_to_order`, метод превратит в `item_order`.

## Примеры

**Пример.** Код получает коды полей из значений:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = Options::getRowsFromFields([
    'WEIGHT_numsel' => 'range',
    'WEIGHT_from' => '1',
    'NAME' => 'kg',
    'CREATED_datesel' => 'YEAR',
]);

echo implode(',', $rows);
```

Код выведет `WEIGHT,NAME,CREATED`.

## Смотрите также

- [Options::fetchPresetFields](fetch-preset-fields.md)
