---
title: Заменить пресеты Options::setPresets
description: Метод Options::setPresets заменяет все пресеты фильтра новым массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setPresets` заменяет все пресеты фильтра новым массивом. Чтобы изменить один пресет, используйте [setFilterSettings](set-filter-settings.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setPresets($presets = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presets | `array` | Задает пресеты — массив `код => настройки`. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод меняет только объект. Чтобы сохранить пресеты, вызовите [save](save.md).

## Примеры

**Пример.** Код заменяет пресеты:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']]]);
$options->setPresets(['light' => ['name' => 'Light', 'fields' => ['WEIGHT_numsel' => 'less', 'WEIGHT_to' => '1']]]);

echo implode(',', array_keys($options->getPresets()));
```

Код выведет `light`.

## Смотрите также

- [Options::getPresets](get-presets.md)
