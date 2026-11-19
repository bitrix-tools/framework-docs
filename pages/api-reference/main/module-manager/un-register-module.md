---
title: Удалить регистрацию модуля ModuleManager::unRegisterModule
description: Метод ModuleManager::unRegisterModule удаляет агенты и права модуля, убирает его из списка установленных и отправляет событие OnAfterUnRegisterModule.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::unRegisterModule` удаляет регистрацию модуля. Вызовите метод в `DoUninstall` установщика модуля.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function unRegisterModule($moduleName)
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

1. Удаляет агенты модуля методом `CAgent::RemoveModuleAgents`.
2. Удаляет права групп на модуль методом `CMain::DelGroupRight`.
3. Вызывает [delete](delete.md), который удаляет запись из `ModuleTable` и сбрасывает кеши.
4. Отправляет событие `OnAfterUnRegisterModule` модуля `main`, в параметрах события — код модуля.

Метод не удаляет таблицы, файлы и обработчики событий модуля. Их удаляет установщик модуля.

## Примеры

**Пример.** Код регистрирует модуль `demo.units`, удаляет регистрацию и проверяет результат:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

ModuleManager::registerModule('demo.units');
ModuleManager::unRegisterModule('demo.units');

var_dump(ModuleManager::isModuleInstalled('demo.units'));
```

Код выведет `bool(false)`.

## Смотрите также

- [ModuleManager::registerModule](register-module.md)
- [Создание модуля](../../../get-started/create-module.md)
