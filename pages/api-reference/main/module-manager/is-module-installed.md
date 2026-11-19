---
title: Проверить, установлен ли модуль ModuleManager::isModuleInstalled
description: Метод ModuleManager::isModuleInstalled проверяет по списку установленных модулей, установлен ли модуль, и не подключает его.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::isModuleInstalled` проверяет, установлен ли модуль. Метод не подключает модуль. Если модуль не подключали раньше, его классы после проверки недоступны. Чтобы проверить и сразу подключить модуль, используйте `Loader::includeModule`.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function isModuleInstalled($moduleName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля, например `iblock` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если модуль есть в списке [getInstalledModules](get-installed-modules.md), иначе `false`.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код проверяет модули `main` и `demo.units`:

  ```php
  <?php
  use Bitrix\Main\ModuleManager;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  var_dump(ModuleManager::isModuleInstalled('main'));
  var_dump(ModuleManager::isModuleInstalled('demo.units'));
  ```

  Код выведет `bool(true)` и `bool(false)`.

- Классический API

  Функция `IsModuleInstalled` вызывает `ModuleManager::isModuleInstalled`.

  **Пример.** Код проверяет модуль `main` через классическую функцию:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  var_dump(IsModuleInstalled('main'));
  ```

{% endlist %}

## Смотрите также

- [ModuleManager::getInstalledModules](get-installed-modules.md)
