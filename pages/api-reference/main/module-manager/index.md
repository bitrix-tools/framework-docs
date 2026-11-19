---
title: ModuleManager — установленные модули
description: Класс Bitrix\Main\ModuleManager проверяет, установлен ли модуль, возвращает версии и список модулей, регистрирует модули и удаляет их регистрацию.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `ModuleManager` работает со списком установленных модулей. Метод [isModuleInstalled](is-module-installed.md) проверяет, установлен ли модуль. В отличие от `Loader::includeModule`, метод не подключает модуль.

Установщик модуля регистрирует модуль методом [registerModule](register-module.md) в `DoInstall` и удаляет регистрацию методом [unRegisterModule](un-register-module.md) в `DoUninstall`. Все методы класса статические.

Аналог в классическом API — функции `IsModuleInstalled`, `RegisterModule` и `UnRegisterModule`. Они вызывают методы этого класса.

Подробнее об установщике — в статье [Создание модуля](../../../get-started/create-module.md).

## Методы класса

Методы делятся на две группы: одни читают сведения о модулях, другие меняют список установленных модулей.

### Проверка и сведения о модулях

| Метод | Описание | С версии |
| --- | --- | --- |
| [isModuleInstalled](is-module-installed.md) | Проверяет, установлен ли модуль | |
| [getInstalledModules](get-installed-modules.md) | Возвращает установленные модули | |
| [getModulesFromDisk](get-modules-from-disk.md) | Возвращает модули из каталогов `/bitrix/modules` и `/local/modules` | |
| [getVersion](get-version.md) | Возвращает версию модуля | |
| [getModificationDateTime](get-modification-date-time.md) | Возвращает время изменения файла версии модуля | |
| [isValidModule](is-valid-module.md) | Проверяет, что код модуля содержит только допустимые символы | |

### Регистрация модулей

| Метод | Описание | С версии |
| --- | --- | --- |
| [registerModule](register-module.md) | Регистрирует модуль и отправляет событие `OnAfterRegisterModule` | |
| [unRegisterModule](un-register-module.md) | Удаляет регистрацию модуля, его агенты и права и отправляет событие `OnAfterUnRegisterModule` | |
| [add](add.md) | Добавляет модуль в список установленных без события | |
| [delete](delete.md) | Удаляет модуль из списка установленных без события | |
| [decreaseVersion](decrease-version.md) | Уменьшает номер версии в файле версии модуля | |

## Смотрите также

- [Создание модуля](../../../get-started/create-module.md)
