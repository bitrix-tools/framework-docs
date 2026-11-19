---
title: Задать ключ filter Options::setCurrentPreset
description: Метод Options::setCurrentPreset задает ключ filter в настройках фильтра. Метод не влияет на текущий пресет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setCurrentPreset` задает ключ `filter` в настройках фильтра. Класс не читает этот ключ, поэтому метод не меняет текущий пресет. Чтобы применить пресет, используйте [setCurrentFilterPresetId](set-current-filter-preset-id.md) или [setFilterSettings](set-filter-settings.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setCurrentPreset($presetId = "default_filter")
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId | `string` | Задает код пресета. По умолчанию — `'default_filter'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код задает ключ и сравнивает его с текущим пресетом:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']]]);
$options->setCurrentPreset('heavy');

echo $options->getOptions()['filter'] . ' ' . $options->getCurrentFilterId();
```

Код выведет `heavy default_filter`.

## Смотрите также

- [Options::setCurrentFilterPresetId](set-current-filter-preset-id.md)
