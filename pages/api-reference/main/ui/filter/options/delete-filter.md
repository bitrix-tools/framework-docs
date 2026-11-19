---
title: Удалить пресет Options::deleteFilter
description: Метод Options::deleteFilter удаляет пресет и отмечает удаленный пресет по умолчанию, чтобы он не вернулся.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::deleteFilter` удаляет пресет из настроек фильтра.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function deleteFilter($presetId, $isDefault = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |
| isDefault | `bool` | Значение `true` отмечает пресет как удаленный. Отметка нужна пресетам по умолчанию, чтобы компонент не показывал их снова. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод меняет только объект. Чтобы сохранить изменение, вызовите [save](save.md).

## Примеры

**Пример.** Код удаляет пресет по умолчанию и проверяет отметку:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);
$options->deleteFilter('active', true);

echo implode(',', array_keys($options->getPresets())) . ' ' . var_export($options->isDeletedPreset('active'), true);
```

Код выведет `heavy true`.

## Смотрите также

- [Options::isDeletedPreset](is-deleted-preset.md)
- [Options::restore](restore.md)
