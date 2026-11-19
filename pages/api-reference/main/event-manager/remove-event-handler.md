---
title: Удалить обработчик, добавленный на время запроса, EventManager::removeEventHandler
description: Метод EventManager::removeEventHandler удаляет обработчик по ключу, который вернул addEventHandler или addEventHandlerCompatible.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::removeEventHandler` удаляет обработчик по ключу. Ключ возвращают [addEventHandler](add-event-handler.md) и [addEventHandlerCompatible](add-event-handler-compatible.md). Чтобы удалить обработчик из базы данных, используйте [unRegisterEventHandler](un-register-event-handler.md).

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function removeEventHandler($fromModuleId, $eventType, $iEventHandlerKey)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fromModuleId\* | `string` | Задает код модуля, который отправляет событие |
| eventType\* | `string` | Задает имя события. Регистр не важен |
| iEventHandlerKey\* | `int` | Задает ключ обработчика |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если обработчик с таким ключом был и метод его удалил, иначе `false`.

## Примеры

**Пример.** Код добавляет обработчик, удаляет его и отправляет событие. Метод `send` не вызывает удаленный обработчик:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$eventManager = EventManager::getInstance();

$key = $eventManager->addEventHandler(
    'main',
    'OnDemoUnitCreate',
    function ()
    {
        echo 'Handler called';
    }
);

var_dump($eventManager->removeEventHandler('main', 'OnDemoUnitCreate', $key));

(new Event('main', 'OnDemoUnitCreate'))->send();
```

Код выведет только `bool(true)`.

## Смотрите также

- [EventManager::addEventHandler](add-event-handler.md)
