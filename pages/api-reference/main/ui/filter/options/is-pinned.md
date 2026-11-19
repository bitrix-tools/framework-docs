---
title: Проверить, закреплен ли пресет Options::isPinned
description: Метод Options::isPinned проверяет, закреплен ли пресет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::isPinned` проверяет, закреплен ли пресет.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function isPinned($presetId): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если код совпадает с [getDefaultFilterId](get-default-filter-id.md), иначе `false`. Метод сравнивает строго, с учетом типа.

## Примеры

**Пример.** Код проверяет два пресета:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);

var_dump($options->isPinned('active'), $options->isPinned('heavy'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Options::pinPreset](pin-preset.md)
