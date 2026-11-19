---
title: Проверить применение закрепленного пресета Options::isUsePinPreset
description: Метод Options::isUsePinPreset проверяет признак use_pin_preset — применяет ли фильтр закрепленный пресет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::isUsePinPreset` проверяет признак `use_pin_preset`. Если признак включен и закреплен пустой пресет `default_filter`, конструктор закрепит пресет с ключом `default`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function isUsePinPreset()
```

## Возвращаемое значение

Метод возвращает значение признака. По умолчанию — `true`.

## Примеры

**Пример.** Код читает признак у нового фильтра:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump((new Options('units_filter'))->isUsePinPreset());
```

Код выведет `bool(true)`.

## Смотрите также

- [Options::setUsePinPreset](set-use-pin-preset.md)
- [Options::pinPreset](pin-preset.md)
