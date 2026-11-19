---
title: Сохранить настройки фильтра Options::save
description: Метод Options::save сохраняет настройки фильтра в настройки пользователя, для гостя — в локальное хранилище сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::save` сохраняет настройки фильтра — пресеты, закрепленный пресет, удаленные пресеты и поля. Изменения из `setFilterSettings`, `pinPreset`, `deleteFilter` и других методов сохранятся только после вызова этого метода.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function save()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Для авторизованного пользователя метод пишет настройки в настройки пользователя категории `main.ui.filter`.
- Для гостя метод пишет настройки в локальное хранилище сессии. Они хранятся до конца сессии.
- Если фильтр использует общие пресеты, метод сохраняет пресеты и в категорию `main.ui.filter.presets`. Для гостя метод не сохраняет общие пресеты.

## Примеры

**Пример.** Код закрепляет пресет, сохраняет настройки и читает их новым объектом:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$presets = [
    'active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
];
$options = new Options('units_filter', $presets);
$options->pinPreset('heavy');
$options->save();

echo (new Options('units_filter', $presets))->getDefaultFilterId();
$options->destroy();
```

Код выведет `heavy`.

## Смотрите также

- [Options::saveForAll](save-for-all.md)
- [Options::destroy](destroy.md)
