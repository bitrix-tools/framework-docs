---
title: Добавить обработчик на время запроса EventManager::addEventHandler
description: Метод EventManager::addEventHandler добавляет обработчик события до конца запроса, обработчик получает объект Bitrix\Main\Event.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::addEventHandler` добавляет обработчик события до конца текущего запроса. Обработчик получает объект события `Bitrix\Main\Event`. Метод не сохраняет обработчик в базе данных, поэтому вызывайте его в каждом запросе, например в `init.php`.

Функция `AddEventHandler` классического API вызывает не этот метод, а [addEventHandlerCompatible](add-event-handler-compatible.md).

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function addEventHandler($fromModuleId, $eventType, $callback, $includeFile = false, $sort = 100)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fromModuleId\* | `string` | Задает код модуля, который отправляет событие, например `main` |
| eventType\* | `string` | Задает имя события, например `OnAfterUserAdd`. Регистр не важен |
| callback\* | `callable` | Задает обработчик — функцию, замыкание или массив `[класс, метод]` |
| includeFile | `string`, `false` | Задает полный путь к файлу, который метод `send` подключит перед вызовом обработчика, если файл существует. По умолчанию — `false` |
| sort | `int` | Задает порядок вызова. Метод `send` вызывает обработчик с меньшим значением раньше. По умолчанию — `100` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает целочисленный ключ обработчика. Передайте ключ в [removeEventHandler](remove-event-handler.md), чтобы удалить обработчик.

## Примеры

**Пример.** Код добавляет обработчик своего события, отправляет событие и выводит параметр:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'main',
    'OnDemoUnitCreate',
    function (Event $event)
    {
        echo 'Created unit ' . $event->getParameter('code');
    }
);

(new Event('main', 'OnDemoUnitCreate', ['code' => 'kg']))->send();
```

Код выведет `Created unit kg`.

## Смотрите также

- [EventManager::removeEventHandler](remove-event-handler.md)
- [EventManager::registerEventHandler](register-event-handler.md)
- [События](../../../framework/events.md)
