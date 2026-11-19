---
title: Сохранить настройки для другого пользователя Options::saveOptionsForUser
description: Метод Options::saveOptionsForUser сохраняет настройки фильтра для указанного пользователя и объединяет пресеты с его пресетами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::saveOptionsForUser` сохраняет настройки фильтра для указанного пользователя. Метод нужен, чтобы раздать пресеты пользователям, у которых уже есть свои настройки.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function saveOptionsForUser($options, $userId)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| options\* | `array` | Задает настройки в формате [getOptions](get-options.md) |
| userId\* | `int` | Задает идентификатор пользователя |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод объединяет пресеты из `options` с пресетами пользователя. Пресеты из `options` заменяют пресеты с тем же кодом, а пресеты из `deleted_presets` удаляются из пресетов пользователя. Права пользователя не проверяются.

## Примеры

**Пример.** Код сохраняет настройки для пользователя с идентификатором `1` и читает их:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']]]);
$options->saveOptionsForUser($options->getOptions(), 1);

$saved = CUserOptions::GetOption('main.ui.filter', 'units_filter', [], 1);

echo implode(',', array_keys($saved['filters']));
CUserOptions::DeleteOption('main.ui.filter', 'units_filter', false, 1);
```

Код выведет `active`.

## Смотрите также

- [Options::getAllUserOptions](get-all-user-options.md)
