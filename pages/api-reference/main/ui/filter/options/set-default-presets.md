---
title: Заменить пресеты по умолчанию Options::setDefaultPresets
description: Метод Options::setDefaultPresets заменяет пресеты по умолчанию, которые получил конструктор.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setDefaultPresets` заменяет пресеты по умолчанию. От них зависят [restore](restore.md) и [getUsedFields](get-used-fields.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setDefaultPresets($presets = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presets | `array` | Задает пресеты — массив `код => настройки`. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод [save](save.md) не сохраняет изменение надолго. Новый объект снова берет пресеты по умолчанию из параметра `filterPresets` конструктора.

## Примеры

**Пример.** Код заменяет пресеты по умолчанию:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setDefaultPresets(['active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']]]);

echo implode(',', array_keys($options->getDefaultPresets()));
```

Код выведет `active`.

## Смотрите также

- [Options::getDefaultPresets](get-default-presets.md)
