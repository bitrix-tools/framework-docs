---
title: Восстановить пресеты по умолчанию Options::restore
description: Метод Options::restore возвращает пресеты по умолчанию, снимает отметку удаления и закрепляет пресет с ключом default.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::restore` возвращает пресеты по умолчанию. Компонент `main.ui.filter` вызывает метод, когда пользователь восстанавливает настройки фильтра.

Метод выполняет шаги по порядку.

1. Записывает настройки каждого переданного пресета.
2. Снимает с этих пресетов отметку удаления.
3. Закрепляет пресет с ключом `default` из пресетов по умолчанию и включает применение закрепленного пресета.
4. Убирает текущий пресет из локального хранилища сессии.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function restore($settings = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| settings | `array` | Задает пресеты — массив `код => настройки`. По умолчанию — пустой массив, тогда метод ничего не делает |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод не меняет пресеты, которых нет в `settings`. Чтобы сохранить результат, вызовите [save](save.md).

## Примеры

**Пример.** Код удаляет пресет и восстанавливает его:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$presets = [
    'active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
];
$options = new Options('units_filter', $presets);
$options->deleteFilter('active', true);
$options->restore($options->getDefaultPresets());

echo implode(',', array_keys($options->getPresets())) . ' ' . var_export($options->isDeletedPreset('active'), true) . ' ' . $options->getDefaultFilterId();
```

Код выведет `heavy,active false active`.

## Смотрите также

- [Options::deleteFilter](delete-filter.md)
- [Options::getDefaultPresets](get-default-presets.md)
