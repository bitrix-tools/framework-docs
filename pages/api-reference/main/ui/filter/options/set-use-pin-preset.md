---
title: Задать применение закрепленного пресета Options::setUsePinPreset
description: Метод Options::setUsePinPreset задает признак use_pin_preset.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setUsePinPreset` задает признак `use_pin_preset`. Метод [pinPreset](pin-preset.md) задает признак сам, поэтому отдельный вызов нужен редко.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setUsePinPreset($value = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| value | `bool` | Задает признак. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код выключает признак:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setUsePinPreset(false);

var_dump($options->isUsePinPreset());
```

Код выведет `bool(false)`.

## Смотрите также

- [Options::isUsePinPreset](is-use-pin-preset.md)
