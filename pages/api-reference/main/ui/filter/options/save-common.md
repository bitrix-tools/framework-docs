---
title: Сохранить общие настройки Options::saveCommon
description: Метод Options::saveCommon сохраняет настройки фильтра как общие для всех пользователей. В общие настройки попадают только пресеты с for_all.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::saveCommon` сохраняет настройки фильтра как общие для всех пользователей — в категорию `main.ui.filter.common`. Пользователь без своих настроек получит общие.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function saveCommon()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- В общие настройки попадают только пресеты с ключом `for_all` = `true`.
- Метод не проверяет права. Для проверки используйте [saveForAll](save-for-all.md).

## Примеры

**Пример.** Код сохраняет общие настройки и читает их новым объектом:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'for_all' => true, 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'for_all' => false, 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);
$options->saveCommon();

echo implode(',', array_keys((new Options('units_filter'))->getPresets()));
CUserOptions::DeleteOption('main.ui.filter.common', 'units_filter', true);
```

Код выведет `active`.

## Смотрите также

- [Options::saveForAll](save-for-all.md)
- [Options::isCommon](is-common.md)
