---
title: Проверить общие пресеты Options::isUseCommonPresets
description: Метод Options::isUseCommonPresets проверяет, использует ли фильтр общие пресеты из параметра commonPresetsId.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::isUseCommonPresets` проверяет, использует ли фильтр общие пресеты. Несколько фильтров делят общие пресеты, например фильтры разных страниц одного раздела. Параметр `commonPresetsId` [конструктора](construct.md) включает их.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function isUseCommonPresets()
```

## Возвращаемое значение

Метод возвращает `true`, если конструктор получил непустую строку `commonPresetsId`, иначе `false`.

## Примеры

**Пример.** Код создает фильтр с общими пресетами:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump((new Options('units_filter'))->isUseCommonPresets(), (new Options('units_filter', [], 'units_common'))->isUseCommonPresets());
```

Код выведет:

```text
bool(false)
bool(true)
```

## Смотрите также

- [Options::getCommonPresetsId](get-common-presets-id.md)
- [Options::fetchCommonPresets](fetch-common-presets.md)
