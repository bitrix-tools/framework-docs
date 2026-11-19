---
title: Задать текущий пресет из кода Options::setCurrentFilterPresetId
description: Метод Options::setCurrentFilterPresetId задает текущий пресет объекта без записи в локальное хранилище сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setCurrentFilterPresetId` задает текущий пресет только для этого объекта. Этот пресет важнее пресета из локального хранилища сессии и закрепленного пресета. Метод нужен, когда код читает значения конкретного пресета, например в экспорте, и не должен менять выбор пользователя.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setCurrentFilterPresetId(?string $presetId): Options
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` или `null` | Задает код пресета. Значение `null` сбрасывает пресет из кода, и метод [getCurrentFilterId](get-current-filter-id.md) снова выбирает пресет по своим правилам |

## Возвращаемое значение

Метод возвращает тот же объект `Options`.

## Особенности

Метод не пишет пресет в локальное хранилище сессии и в настройки пользователя. Другие объекты фильтра его не увидят.

## Примеры

**Пример.** Код читает значения пресета, который не применен:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);
$filter = $options->setCurrentFilterPresetId('heavy')->getFilter();

echo $filter['PRESET_ID'] . ' ' . $filter['WEIGHT_from'] . ' ' . $options->getDefaultFilterId();
```

Код выведет `heavy 10 active`.

## Смотрите также

- [Options::getCurrentFilterPresetId](get-current-filter-preset-id.md)
- [Options::getCurrentFilterId](get-current-filter-id.md)
