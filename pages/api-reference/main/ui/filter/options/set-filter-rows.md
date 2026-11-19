---
title: Задать поля пресета Options::setFilterRows
description: Метод Options::setFilterRows задает поля пресета — какие поля и в каком порядке показывает фильтр.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setFilterRows` задает поля пресета — какие поля и в каком порядке показывает фильтр, когда пресет выбран.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setFilterRows($presetId, $rows)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета. Пустая строка задает поля фильтра без пресета — ключ `filter_rows` в корне настроек |
| rows\* | `string` | Задает коды полей через запятую. Метод убирает пробелы и пустые элементы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код задает поля пресета строкой с пробелами:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['heavy' => ['name' => 'Heavy', 'fields' => []]]);
$options->setFilterRows('heavy', 'WEIGHT, NAME,,');

echo $options->getFilterSettings('heavy')['filter_rows'];
```

Код выведет `WEIGHT,NAME`.

## Смотрите также

- [Options::removeRowFromPreset](remove-row-from-preset.md)
- [Options::fetchPresetFields](fetch-preset-fields.md)
