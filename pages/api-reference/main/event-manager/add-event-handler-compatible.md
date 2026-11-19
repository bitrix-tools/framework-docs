---
title: Добавить обработчик в режиме совместимости EventManager::addEventHandlerCompatible
description: Метод EventManager::addEventHandlerCompatible добавляет обработчик события до конца запроса, обработчик получает параметры события отдельными аргументами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::addEventHandlerCompatible` добавляет обработчик события до конца текущего запроса. В отличие от [addEventHandler](add-event-handler.md), обработчик получает не объект события, а значения его параметров отдельными аргументами. Такой формат нужен для событий классического ядра, например `OnBeforeUserAdd`.

Функция `AddEventHandler` классического API вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function addEventHandlerCompatible($fromModuleId, $eventType, $callback, $includeFile = false, $sort = 100)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fromModuleId\* | `string` | Задает код модуля, который отправляет событие |
| eventType\* | `string` | Задает имя события. Регистр не важен |
| callback\* | `callable` | Задает обработчик |
| includeFile | `string`, `false` | Задает полный путь к файлу, который метод `send` подключит перед вызовом обработчика, если файл существует. По умолчанию — `false` |
| sort | `int` | Задает порядок вызова. Метод `send` вызывает обработчик с меньшим значением раньше. По умолчанию — `100` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает целочисленный ключ обработчика для [removeEventHandler](remove-event-handler.md).

## Особенности

Метод [send](send.md) передает обработчику значения параметров события по порядку, обработчик не получает ключи параметров.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код добавляет обработчик, который получает код и сортировку единицы измерения отдельными аргументами:

  ```php
  <?php
  use Bitrix\Main\Event;
  use Bitrix\Main\EventManager;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  EventManager::getInstance()->addEventHandlerCompatible(
      'main',
      'OnDemoUnitCreate',
      function ($code, $sort)
      {
          echo $code . ' ' . $sort;
      }
  );

  (new Event('main', 'OnDemoUnitCreate', ['code' => 'kg', 'sort' => 100]))->send();
  ```

  Код выведет `kg 100`.

- Классический API

  У функции `AddEventHandler` другой порядок необязательных параметров: сначала сортировка, затем путь к файлу.

  **Пример.** Функция `AddEventHandler` добавляет такой же обработчик:

  ```php
  <?php
  use Bitrix\Main\Event;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  AddEventHandler(
      'main',
      'OnDemoUnitCreate',
      function ($code, $sort)
      {
          echo $code . ' ' . $sort;
      }
  );

  (new Event('main', 'OnDemoUnitCreate', ['code' => 'kg', 'sort' => 100]))->send();
  ```

  Код выведет `kg 100`.

{% endlist %}

## Смотрите также

- [EventManager::addEventHandler](add-event-handler.md)
- [События](../../../framework/events.md)
