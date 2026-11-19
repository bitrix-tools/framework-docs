---
title: Сохранить настройки для всех Options::saveForAll
description: Метод Options::saveForAll сохраняет настройки фильтра для всех пользователей, если у текущего пользователя есть право edit_other_settings.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::saveForAll` сохраняет настройки фильтра для всех пользователей. Метод проверяет право текущего пользователя `edit_other_settings` и вызывает [saveCommon](save-common.md). Компонент `main.ui.filter` вызывает метод, когда администратор сохраняет пресет с отметкой «Для всех».

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function saveForAll(): void
```

## Возвращаемое значение

Метод ничего не возвращает. Если права нет, метод ничего не делает.

## Примеры

**Пример.** Код пробует сохранить настройки для всех без права:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'for_all' => true, 'fields' => ['ACTIVE' => 'Y']]]);
$options->saveForAll();

$common = CUserOptions::GetOption('main.ui.filter.common', 'units_filter', [], 0);

echo var_export(Options::isCurrentUserEditOtherSettings(), true) . ' ' . count($common);
```

Код выведет `false 0`. Скрипт работает от гостя, у которого нет права, поэтому общие настройки не появились.

## Смотрите также

- [Options::saveCommon](save-common.md)
- [Options::isCurrentUserEditOtherSettings](is-current-user-edit-other-settings.md)
