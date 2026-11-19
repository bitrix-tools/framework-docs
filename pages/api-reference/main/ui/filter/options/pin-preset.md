---
title: Закрепить пресет Options::pinPreset
description: Метод Options::pinPreset закрепляет пресет — фильтр будет применять его по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::pinPreset` закрепляет пресет. Фильтр применяет закрепленный пресет, пока пользователь не выбрал другой. Компонент `main.ui.filter` вызывает метод, когда пользователь закрепляет пресет в интерфейсе.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function pinPreset($presetId = "default_filter")
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId | `string` | Задает код пресета. По умолчанию — `'default_filter'`, это открепляет пресет |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Для `default_filter` метод выключает признак применения закрепленного пресета, для остальных пресетов — включает.
- Чтобы сохранить изменение, вызовите [save](save.md).

## Примеры

**Пример.** Код закрепляет и открепляет пресет:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']]]);
$options->pinPreset('heavy');
$pinned = $options->getDefaultFilterId() . ' ' . var_export($options->isUsePinPreset(), true);
$options->pinPreset();

echo $pinned . ' / ' . $options->getDefaultFilterId() . ' ' . var_export($options->isUsePinPreset(), true);
```

Код выведет `heavy true / default_filter false`.

## Смотрите также

- [Options::isPinned](is-pinned.md)
- [Options::setDefaultPreset](set-default-preset.md)
