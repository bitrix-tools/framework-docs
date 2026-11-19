---
title: Проверить, удален ли пресет Options::isDeletedPreset
description: Метод Options::isDeletedPreset проверяет, есть ли пресет в списке удаленных пресетов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::isDeletedPreset` проверяет, есть ли пресет в списке удаленных. Пресет попадает в список через [deleteFilter](delete-filter.md) с `isDefault` = `true`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function isDeletedPreset($presetId)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если пресет в списке удаленных, иначе `false`.

## Примеры

**Пример.** Код проверяет пресет до и после удаления:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']]]);
$before = $options->isDeletedPreset('active');
$options->deleteFilter('active', true);

var_dump($before, $options->isDeletedPreset('active'));
```

Код выведет:

```text
bool(false)
bool(true)
```

## Смотрите также

- [Options::deleteFilter](delete-filter.md)
- [Options::setDeletedPresets](set-deleted-presets.md)
