---
title: Зарегистрировать обработчик в режиме совместимости EventManager::registerEventHandlerCompatible
description: Метод EventManager::registerEventHandlerCompatible сохраняет обработчик события в базе данных, обработчик получает параметры события отдельными аргументами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::registerEventHandlerCompatible` сохраняет обработчик события в базе данных. В отличие от [registerEventHandler](register-event-handler.md), обработчик получает значения параметров события отдельными аргументами. Такой формат нужен для событий классического ядра, например `OnBeforeUserAdd`.

Аналог в классическом API — функция `RegisterModuleDependences`. Она вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function registerEventHandlerCompatible($fromModuleId, $eventType, $toModuleId, $toClass = '', $toMethod = '', $sort = 100, $toPath = '', $toMethodArg = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fromModuleId\* | `string` | Задает код модуля, который отправляет событие |
| eventType\* | `string` | Задает имя события |
| toModuleId\* | `string` | Задает код модуля обработчика. Перед вызовом обработчика метод `send` подключает этот модуль, если это не `main` |
| toClass | `string` | Задает имя класса обработчика. По умолчанию — пустая строка |
| toMethod | `string` | Задает имя статического метода обработчика. По умолчанию — пустая строка |
| sort | `int` | Задает порядок вызова. Метод `send` вызывает обработчик с меньшим значением раньше. По умолчанию — `100` |
| toPath | `string` | Задает путь к файлу относительно каталога `/local/` или `/bitrix/`. Если `toModuleId` пустой или `main`, метод `send` ищет файл сначала в `/local/`, затем в `/bitrix/` и подключает его перед вызовом. По умолчанию — пустая строка |
| toMethodArg | `array` | Задает аргументы, которые метод `send` передаст обработчику перед параметрами события. По умолчанию — пустой массив |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код регистрирует обработчик события `OnBeforeUserAdd` для модуля `demo.units` и удаляет регистрацию. В модуле эти вызовы размещают в методах `InstallDB` и `UnInstallDB` установщика:

  ```php
  <?php
  use Bitrix\Main\EventManager;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $eventManager = EventManager::getInstance();
  $eventManager->registerEventHandlerCompatible(
      'main',
      'OnBeforeUserAdd',
      'demo.units',
      '\Demo\Units\UserHandler',
      'onBeforeUserAdd'
  );

  // удалить регистрацию, например в UnInstallDB
  $eventManager->unRegisterEventHandler(
      'main',
      'OnBeforeUserAdd',
      'demo.units',
      '\Demo\Units\UserHandler',
      'onBeforeUserAdd'
  );
  ```

- Классический API

  **Пример.** Функции `RegisterModuleDependences` и `UnRegisterModuleDependences` выполняют те же действия:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  RegisterModuleDependences('main', 'OnBeforeUserAdd', 'demo.units', '\Demo\Units\UserHandler', 'onBeforeUserAdd');
  UnRegisterModuleDependences('main', 'OnBeforeUserAdd', 'demo.units', '\Demo\Units\UserHandler', 'onBeforeUserAdd');
  ```

{% endlist %}

## Смотрите также

- [EventManager::registerEventHandler](register-event-handler.md)
- [EventManager::unRegisterEventHandler](un-register-event-handler.md)
