---
title: Добавить модуль в список установленных ModuleManager::add
description: Метод ModuleManager::add добавляет модуль в список установленных, включает его агенты и сбрасывает кеши без события регистрации.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::add` добавляет модуль в список установленных. В отличие от [registerModule](register-module.md), метод не отправляет событие `OnAfterRegisterModule`. Для установщика модуля используйте `registerModule`.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function add($moduleName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод по порядку:

1. Добавляет запись в `ModuleTable`.
2. Включает неактивные агенты модуля.
3. Сбрасывает список установленных модулей, кеш `Loader` для модуля и загруженные обработчики событий.

Если модуль уже есть в списке, `ModuleTable::add` выбрасывает `Bitrix\Main\DB\DuplicateEntryException`. Метод перехватывает исключение и пропускает шаги 2 и 3.

## Примеры

**Пример.** Код добавляет модуль `demo.units` без события и в блоке `finally` удаляет его:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    ModuleManager::add('demo.units');
    var_dump(ModuleManager::isModuleInstalled('demo.units'));
}
finally
{
    ModuleManager::delete('demo.units');
}
```

Код выведет `bool(true)`.

## Смотрите также

- [ModuleManager::delete](delete.md)
- [ModuleManager::registerModule](register-module.md)
