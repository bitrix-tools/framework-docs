---
title: EventManager — обработчики событий
description: Класс Bitrix\Main\EventManager добавляет обработчики событий на время запроса, регистрирует их постоянно в базе данных и отправляет события обработчикам.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `EventManager` связывает события с обработчиками. Объект класса один на запрос, его возвращает [getInstance](get-instance.md).

Обработчик подключают одним из двух способов:

- на время запроса — методом [addEventHandler](add-event-handler.md), например в `init.php` или `include.php` модуля,
- постоянно — методом [registerEventHandler](register-event-handler.md) в установщике модуля.

Постоянную регистрацию класс хранит в базе данных, пока ее не удалит [unRegisterEventHandler](un-register-event-handler.md).

Методы без суффикса `Compatible` передают обработчику объект события `Bitrix\Main\Event`. Методы с суффиксом `Compatible` передают значения параметров события отдельными аргументами, как требуют события классического ядра, например `OnBeforeUserAdd`.

Аналог в классическом API — функции `AddEventHandler`, `RemoveEventHandler`, `RegisterModuleDependences`, `UnRegisterModuleDependences` и `GetModuleEvents`.

Подробнее — в статье [События](../../../framework/events.md).

## Методы класса

Методы делятся на четыре группы по назначению.

### Объект класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getInstance](get-instance.md) | Возвращает объект класса | |
| [setInstance](set-instance.md) | Заменяет объект класса | |

### Обработчики на время запроса

| Метод | Описание | С версии |
| --- | --- | --- |
| [addEventHandler](add-event-handler.md) | Добавляет обработчик, который получает объект события | |
| [addEventHandlerCompatible](add-event-handler-compatible.md) | Добавляет обработчик, который получает параметры события отдельными аргументами | |
| [removeEventHandler](remove-event-handler.md) | Удаляет обработчик, добавленный в текущем запросе, по ключу | |

### Постоянная регистрация

| Метод | Описание | С версии |
| --- | --- | --- |
| [registerEventHandler](register-event-handler.md) | Сохраняет обработчик в базе данных, обработчик получает объект события | |
| [registerEventHandlerCompatible](register-event-handler-compatible.md) | Сохраняет обработчик в базе данных, обработчик получает параметры события отдельными аргументами | |
| [unRegisterEventHandler](un-register-event-handler.md) | Удаляет регистрацию обработчика из базы данных | |
| [clearLoadedHandlers](clear-loaded-handlers.md) | Сбрасывает кеш обработчиков из базы данных | |

### Поиск и отправка

| Метод | Описание | С версии |
| --- | --- | --- |
| [findEventHandlers](find-event-handlers.md) | Возвращает обработчики события | |
| [send](send.md) | Вызывает обработчики события | |

## Смотрите также

- [EventResult](../event-result/index.md)
- [ORM\Event](../orm/event/index.md)
- [События](../../../framework/events.md)
