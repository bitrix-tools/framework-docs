---
title: Получить закрепленный пресет Options::getDefaultFilterId
description: Метод Options::getDefaultFilterId возвращает код закрепленного пресета — его фильтр применяет, пока пользователь не выбрал другой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getDefaultFilterId` возвращает код закрепленного пресета. Фильтр применяет его, пока пользователь не выбрал другой пресет.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getDefaultFilterId()
```

## Возвращаемое значение

Метод возвращает код пресета. Если закрепленного пресета нет, метод возвращает `'default_filter'`.

## Примеры

**Пример.** Код закрепляет пресет и читает его:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']]]);
$before = $options->getDefaultFilterId();
$options->pinPreset('heavy');

echo $before . ' ' . $options->getDefaultFilterId();
```

Код выведет `default_filter heavy`.

## Смотрите также

- [Options::pinPreset](pin-preset.md)
- [Options::getCurrentFilterId](get-current-filter-id.md)
