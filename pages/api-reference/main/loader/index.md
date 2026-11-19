---
title: Loader — подключение модулей и автозагрузка классов
description: Класс Bitrix\Main\Loader подключает модули, регистрирует пространства имен и классы для автозагрузки и ищет файлы в каталогах /local/ и /bitrix/.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Loader` подключает модули и загружает классы. Перед вызовом классов модуля, кроме `main`, подключите модуль методом [includeModule](include-module.md) или [requireModule](require-module.md).

Ядро регистрирует метод [autoLoad](auto-load.md) как автозагрузчик PHP в файле `/bitrix/modules/main/include/autoload.php`. Автозагрузчик ищет класс по порядку:

- псевдоним из [registerClassAliases](register-class-aliases.md),
- прямой путь из [registerAutoLoadClasses](register-auto-load-classes.md),
- пространство имен PSR-4 из [registerNamespace](register-namespace.md).

Метод `includeModule` сам регистрирует пространство имен каталога `lib` для каждого подключенного модуля.

Все методы класса статические. Аналоги в классическом API — `CModule::IncludeModule` и `CModule::IncludeModuleEx`, они вызывают методы этого класса.

Подробнее — в статье [Автозагрузка классов](../../../framework/autoloading.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [includeModule](include-module.md) | Подключает модуль | |
| [requireModule](require-module.md) | Подключает модуль или выбрасывает исключение | |
| [setRequireThrowException](set-require-throw-exception.md) | Включает или отключает исключение при подключении модуля методом `requireModule` | |
| [includeSharewareModule](include-shareware-module.md) | Подключает модуль с демо-режимом и возвращает его состояние | 14.0.2 |
| [clearModuleCache](clear-module-cache.md) | Сбрасывает запомненный результат подключения модуля | |
| [registerNamespace](register-namespace.md) | Регистрирует каталог для пространства имен | |
| [unregisterNamespace](unregister-namespace.md) | Удаляет регистрацию пространства имен | |
| [getNamespaces](get-namespaces.md) | Возвращает зарегистрированные пространства имен | |
| [registerAutoLoadClasses](register-auto-load-classes.md) | Регистрирует файлы классов для автозагрузки | |
| [registerClassAliases](register-class-aliases.md) | Регистрирует псевдонимы классов | |
| [registerHandler](register-handler.md) | Добавляет свой автозагрузчик | |
| [autoLoad](auto-load.md) | Загружает класс по имени | |
| [requireClass](require-class.md) | Подключает модуль класса и загружает класс | |
| [getDocumentRoot](get-document-root.md) | Возвращает корень сайта | 14.0.0 |
| [getLocal](get-local.md) | Находит файл в каталоге `/local/` или `/bitrix/` | |
| [getPersonal](get-personal.md) | Находит файл в персональном каталоге, `/local/` или `/bitrix/` | |
| [includeComposerAutoload](include-composer-autoload.md) | Подключает автозагрузчик Composer из настроек | |

## Константы

| Константа | Значение | Назначение |
| --- | --- | --- |
| `MODULE_NOT_FOUND` | `0` | Модуль не найден или не установлен |
| `MODULE_INSTALLED` | `1` | Модуль подключен и работает |
| `MODULE_DEMO` | `2` | Модуль работает в демо-режиме |
| `MODULE_DEMO_EXPIRED` | `3` | Демо-период модуля закончился |
| `BITRIX_HOLDER` | `bitrix` | Каталог модулей ядра — `/bitrix/modules/` |
| `LOCAL_HOLDER` | `local` | Каталог своих модулей — `/local/modules/` |
| `SAFE_MODE` | `false` | Режим, в котором подключаются только модули `main` и `fileman` |

Метод [includeSharewareModule](include-shareware-module.md) возвращает константы `MODULE_*`. Константы `ALPHA_LOWER` и `ALPHA_UPPER` устарели.

## Смотрите также

- [Автозагрузка классов](../../../framework/autoloading.md)
- [ModuleManager](../module-manager/index.md)
- [Path](../io/path/index.md)
