---
title: Получить установленные модули ModuleManager::getInstalledModules
description: Метод ModuleManager::getInstalledModules возвращает установленные модули из таблицы модулей с кешированием.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::getInstalledModules` возвращает список установленных модулей.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function getInstalledModules()
```

## Возвращаемое значение

Метод возвращает массив, отсортированный по коду модуля. Ключ — код модуля, значение — массив с одним ключом `ID`, в котором тот же код.

## Особенности

Метод читает список из ORM-класса `Bitrix\Main\ModuleTable` с кешем на 86 400 секунд и запоминает его до конца запроса. Методы [add](add.md) и [delete](delete.md) сбрасывают запомненный список.

## Примеры

**Пример.** Код выводит число установленных модулей и проверяет, есть ли среди них `main`:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$modules = ModuleManager::getInstalledModules();

echo count($modules) . PHP_EOL;
var_dump(isset($modules['main']));
```

## Смотрите также

- [ModuleManager::isModuleInstalled](is-module-installed.md)
- [ModuleManager::getModulesFromDisk](get-modules-from-disk.md)
