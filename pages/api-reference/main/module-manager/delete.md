---
title: Удалить модуль из списка установленных ModuleManager::delete
description: Метод ModuleManager::delete удаляет модуль из списка установленных, отключает его агенты и сбрасывает кеши без события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::delete` удаляет модуль из списка установленных. В отличие от [unRegisterModule](un-register-module.md), метод не удаляет агенты и права модуля и не отправляет событие `OnAfterUnRegisterModule`. Для установщика модуля используйте `unRegisterModule`.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function delete($moduleName)
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

1. Удаляет запись из `ModuleTable`.
2. Отключает активные агенты модуля, но не удаляет их. Метод [add](add.md) включит их снова.
3. Сбрасывает список установленных модулей, кеш `Loader` для модуля и загруженные обработчики событий.

## Примеры

**Пример.** Код добавляет модуль `demo.units`, удаляет его и проверяет результат:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

ModuleManager::add('demo.units');
ModuleManager::delete('demo.units');

var_dump(ModuleManager::isModuleInstalled('demo.units'));
```

Код выведет `bool(false)`.

## Смотрите также

- [ModuleManager::add](add.md)
- [ModuleManager::unRegisterModule](un-register-module.md)
