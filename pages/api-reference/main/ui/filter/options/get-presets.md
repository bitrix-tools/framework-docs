---
title: Получить пресеты Options::getPresets
description: Метод Options::getPresets возвращает пресеты фильтра — сохраненные пользователем или пресеты по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getPresets` возвращает пресеты фильтра. Если пользователь не сохранял пресеты, метод возвращает пресеты по умолчанию из конструктора.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getPresets()
```

## Возвращаемое значение

Метод возвращает массив `код пресета => настройки`. Настройки содержат ключи `name`, `fields`, `filter_rows`, `sort`, `for_all`.

## Примеры

**Пример.** Код выводит коды и названия пресетов:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);

foreach ($options->getPresets() as $code => $preset)
{
    echo $code . ': ' . $preset['name'] . "\n";
}
```

Код выведет:

```text
active: Active
heavy: Heavy
```

## Смотрите также

- [Options::setPresets](set-presets.md)
- [Options::getDefaultPresets](get-default-presets.md)
