---
title: Получить пресеты по умолчанию Options::getDefaultPresets
description: Метод Options::getDefaultPresets возвращает пресеты, которые получил конструктор из параметров компонента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getDefaultPresets` возвращает пресеты по умолчанию — те, что получил [конструктор](construct.md) в параметре `filterPresets`. В отличие от [getPresets](get-presets.md), метод не учитывает изменения пользователя.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getDefaultPresets()
```

## Возвращаемое значение

Метод возвращает массив `код пресета => настройки`. Если пресетов не передали, метод возвращает пустой массив.

## Примеры

**Пример.** Код удаляет пресет и сравнивает два списка:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);
$options->deleteFilter('heavy', true);

echo implode(',', array_keys($options->getPresets())) . ' / ' . implode(',', array_keys($options->getDefaultPresets()));
```

Код выведет `active / active,heavy`.

## Смотрите также

- [Options::setDefaultPresets](set-default-presets.md)
- [Options::restore](restore.md)
