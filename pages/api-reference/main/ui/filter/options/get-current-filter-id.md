---
title: Получить текущий пресет Options::getCurrentFilterId
description: Метод Options::getCurrentFilterId возвращает код пресета, который сейчас применяет фильтр.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getCurrentFilterId` возвращает код текущего пресета — того, значения которого возвращает [getFilter](get-filter.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getCurrentFilterId()
```

## Возвращаемое значение

Метод возвращает код пресета и выбирает его по порядку.

1. Пресет, который задал код методом [setCurrentFilterPresetId](set-current-filter-preset-id.md), если он не `null`.
2. Иначе — пресет из локального хранилища сессии, который применил пользователь, — [getSessionFilterId](get-session-filter-id.md).
3. Если результат пустой — закрепленный пресет, [getDefaultFilterId](get-default-filter-id.md).

Если код задал пустую строку, метод пропустит пресет из сессии и вернет закрепленный.

## Примеры

**Пример.** Код читает текущий пресет до и после применения другого:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);
$before = $options->getCurrentFilterId();
$options->setFilterSettings('heavy', $options->getFilterSettings('heavy'), true, false);

echo $before . ' ' . $options->getCurrentFilterId();
```

Код выведет `active heavy`.

## Смотрите также

- [Options::getDefaultFilterId](get-default-filter-id.md)
- [Options::getSessionFilterId](get-session-filter-id.md)
