---
title: Получить идентификатор общих пресетов Options::getCommonPresetsId
description: Метод Options::getCommonPresetsId возвращает идентификатор общих пресетов, который получил конструктор.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getCommonPresetsId` возвращает идентификатор общих пресетов — параметр `commonPresetsId` [конструктора](construct.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getCommonPresetsId()
```

## Возвращаемое значение

Метод возвращает строку или `null`, если фильтр не использует общие пресеты.

## Примеры

**Пример.** Код читает идентификатор общих пресетов:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new Options('units_filter', [], 'units_common'))->getCommonPresetsId();
```

Код выведет `units_common`.

## Смотрите также

- [Options::isUseCommonPresets](is-use-common-presets.md)
