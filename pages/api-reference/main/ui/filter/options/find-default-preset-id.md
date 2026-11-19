---
title: Найти пресет с ключом default Options::findDefaultPresetId
description: Статический метод Options::findDefaultPresetId находит в массиве пресетов пресет с ключом default.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::findDefaultPresetId` находит в массиве пресет с ключом `default` = `true`. Конструктор и [restore](restore.md) так выбирают закрепленный пресет.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function findDefaultPresetId($presets = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presets | `array` | Задает пресеты — массив `код => настройки`. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает код пресета. Если пресетов с ключом `default` несколько, метод возвращает последний. Если таких нет, метод возвращает `'default_filter'`.

## Примеры

**Пример.** Код ищет пресет с ключом `default` в массиве и в пустом массиве:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$presets = [
    'active' => ['name' => 'Active'],
    'heavy' => ['name' => 'Heavy', 'default' => true],
];

echo Options::findDefaultPresetId($presets) . ' ' . Options::findDefaultPresetId([]);
```

Код выведет `heavy default_filter`.

## Смотрите также

- [Options::getDefaultFilterId](get-default-filter-id.md)
