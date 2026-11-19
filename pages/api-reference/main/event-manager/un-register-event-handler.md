---
title: Удалить регистрацию обработчика EventManager::unRegisterEventHandler
description: Метод EventManager::unRegisterEventHandler удаляет из базы данных обработчик события, зарегистрированный registerEventHandler или registerEventHandlerCompatible.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::unRegisterEventHandler` удаляет регистрацию обработчика из базы данных. Метод удаляет регистрации, сделанные [registerEventHandler](register-event-handler.md) и [registerEventHandlerCompatible](register-event-handler-compatible.md). Вызовите метод в установщике модуля, когда модуль удаляют, например в `UnInstallDB`.

Аналог в классическом API — функция `UnRegisterModuleDependences`. Она вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function unRegisterEventHandler($fromModuleId, $eventType, $toModuleId, $toClass = '', $toMethod = '', $toPath = '', $toMethodArg = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fromModuleId\* | `string` | Задает код модуля, который отправляет событие |
| eventType\* | `string` | Задает имя события |
| toModuleId\* | `string` | Задает код модуля обработчика |
| toClass | `string` | Задает имя класса обработчика. По умолчанию — пустая строка |
| toMethod | `string` | Задает имя метода обработчика. По умолчанию — пустая строка |
| toPath | `string` | Задает путь к файлу обработчика. По умолчанию — пустая строка |
| toMethodArg | `array` | Задает аргументы обработчика. По умолчанию — пустой массив |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод удаляет записи, у которых совпадают все переданные значения. Пустое значение параметра совпадает только с пустым значением в записи. Поэтому передайте те же `toClass`, `toMethod`, `toPath` и `toMethodArg`, что и при регистрации, иначе запись останется.

Если метод удалил хотя бы одну запись, он сбрасывает кеш обработчиков методом [clearLoadedHandlers](clear-loaded-handlers.md).

## Примеры

**Пример.** Код регистрирует обработчик, удаляет регистрацию и проверяет, что у события `OnDemoUnitCreate` не осталось обработчиков:

```php
<?php
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$eventManager = EventManager::getInstance();
$eventManager->registerEventHandler('main', 'OnDemoUnitCreate', 'main', 'DemoUnitHandler', 'onCreate');
$eventManager->unRegisterEventHandler('main', 'OnDemoUnitCreate', 'main', 'DemoUnitHandler', 'onCreate');

echo count($eventManager->findEventHandlers('main', 'OnDemoUnitCreate'));
```

Код выведет `0`.

## Смотрите также

- [EventManager::registerEventHandler](register-event-handler.md)
