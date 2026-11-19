---
title: Получить версию модуля ModuleManager::getVersion
description: Метод ModuleManager::getVersion возвращает версию установленного модуля из файла version.php или false.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::getVersion` возвращает версию установленного модуля. Метод берет версию `main` из константы `SM_VERSION`, версию другого модуля — из файла `install/version.php` модуля.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function getVersion($moduleName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку с версией, например `26.150.0`. Метод возвращает `false`, если:

- код модуля не проходит проверку [isValidModule](is-valid-module.md),
- модуль не установлен,
- файла `install/version.php` нет или в нем нет ключа `VERSION`.

Метод ищет файл версии сначала в `/local/modules`, затем в `/bitrix/modules`.

## Примеры

**Пример.** Код проверяет, что версия модуля `main` не ниже 24.0.0:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$version = ModuleManager::getVersion('main');

var_dump($version !== false && version_compare($version, '24.0.0', '>='));
```

Код выведет `bool(true)`.

## Смотрите также

- [ModuleManager::getModificationDateTime](get-modification-date-time.md)
