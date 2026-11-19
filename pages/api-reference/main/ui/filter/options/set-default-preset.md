---
title: Задать закрепленный пресет Options::setDefaultPreset
description: Метод Options::setDefaultPreset задает закрепленный пресет, не меняя признак use_pin_preset.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setDefaultPreset` задает закрепленный пресет. В отличие от [pinPreset](pin-preset.md), метод не меняет признак применения закрепленного пресета.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setDefaultPreset($presetId = "default_filter")
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId | `string` | Задает код пресета. По умолчанию — `'default_filter'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Если признак применения закрепленного пресета включен, конструктор заменит `default_filter` на пресет с ключом `default`. Поэтому, чтобы открепить пресет, используйте `pinPreset('default_filter')`.

## Примеры

**Пример.** Код задает закрепленный пресет:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']]]);
$options->setDefaultPreset('heavy');

echo $options->getDefaultFilterId();
```

Код выведет `heavy`.

## Смотрите также

- [Options::pinPreset](pin-preset.md)
- [Options::getDefaultFilterId](get-default-filter-id.md)
