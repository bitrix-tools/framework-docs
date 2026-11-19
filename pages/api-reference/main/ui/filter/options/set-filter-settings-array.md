---
title: Задать настройки нескольких пресетов Options::setFilterSettingsArray
description: Метод Options::setFilterSettingsArray задает настройки нескольких пресетов, не меняя текущий пресет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setFilterSettingsArray` задает настройки нескольких пресетов. Метод вызывает [setFilterSettings](set-filter-settings.md) для каждого пресета и не меняет текущий пресет. Компонент `main.ui.filter` вызывает метод, когда пользователь сохраняет список пресетов.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setFilterSettingsArray($presets = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presets | `array` | Задает пресеты — массив `код => настройки` в формате [setFilterSettings](set-filter-settings.md). По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Если POST-запрос содержит `params[forAll]=true`, метод вызывает [saveForAll](save-for-all.md).

## Примеры

**Пример.** Код задает настройки двух пресетов:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setFilterSettingsArray([
    'active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);

echo implode(',', array_keys($options->getPresets())) . ' ' . $options->getCurrentFilterId();
```

Код выведет `active,heavy default_filter`.

## Смотрите также

- [Options::setFilterSettings](set-filter-settings.md)
