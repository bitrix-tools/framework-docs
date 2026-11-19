---
title: Получить пресет из кода Options::getCurrentFilterPresetId
description: Метод Options::getCurrentFilterPresetId возвращает пресет, который код задал методом setCurrentFilterPresetId.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getCurrentFilterPresetId` возвращает пресет, который код задал методом [setCurrentFilterPresetId](set-current-filter-preset-id.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getCurrentFilterPresetId(): ?string
```

## Возвращаемое значение

Метод возвращает код пресета или `null`, если код не задавал пресет.

## Примеры

**Пример.** Код задает пресет и читает его:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$before = $options->getCurrentFilterPresetId();
$options->setCurrentFilterPresetId('heavy');

echo var_export($before, true) . ' ' . $options->getCurrentFilterPresetId();
```

Код выведет `NULL heavy`.

## Смотрите также

- [Options::setCurrentFilterPresetId](set-current-filter-preset-id.md)
