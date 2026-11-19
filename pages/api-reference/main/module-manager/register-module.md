---
title: Зарегистрировать модуль ModuleManager::registerModule
description: Метод ModuleManager::registerModule добавляет модуль в список установленных и отправляет событие OnAfterRegisterModule.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::registerModule` регистрирует модуль как установленный. Вызовите метод в `DoInstall` установщика модуля, после того как установщик создаст таблицы и скопирует файлы.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function registerModule($moduleName)
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

Метод вызывает [add](add.md). Метод `add` добавляет запись в `ModuleTable`, включает агенты модуля и сбрасывает кеши. Если модуль уже зарегистрирован, метод `add` ничего не меняет.

Затем метод отправляет событие `OnAfterRegisterModule` модуля `main`, в параметрах события — код модуля. Событие отправляется, даже если модуль уже был зарегистрирован.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код регистрирует модуль `demo.units`, проверяет регистрацию и в блоке `finally` удаляет ее:

  ```php
  <?php
  use Bitrix\Main\ModuleManager;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  try
  {
      ModuleManager::registerModule('demo.units');
      var_dump(ModuleManager::isModuleInstalled('demo.units'));
  }
  finally
  {
      ModuleManager::unRegisterModule('demo.units');
  }
  ```

  Код выведет `bool(true)`.

- Классический API

  Функция `RegisterModule` вызывает `ModuleManager::registerModule`.

  **Пример.** Код регистрирует модуль через классическую функцию, проверяет регистрацию и в блоке `finally` удаляет ее:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  try
  {
      RegisterModule('demo.units');
      var_dump(IsModuleInstalled('demo.units'));
  }
  finally
  {
      UnRegisterModule('demo.units');
  }
  ```

{% endlist %}

## Смотрите также

- [ModuleManager::unRegisterModule](un-register-module.md)
- [Создание модуля](../../../get-started/create-module.md)
