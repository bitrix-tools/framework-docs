---
title: Event — событие модуля
description: Класс Bitrix\Main\Event создает событие модуля с параметрами, отправляет его обработчикам и собирает их результаты.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `Event` хранит код модуля, имя и параметры события. Модуль создает объект события, чтобы обработчики других модулей могли вмешаться в операцию, и вызывает [send](send.md). Метод [EventManager::send](../event-manager/send.md) вызывает обработчики, а модуль читает их результаты методом [getResults](get-results.md).

Обработчик, который получает объект события, читает параметры методом [getParameter](get-parameter.md) и возвращает [EventResult](../event-result/index.md). Обработчик в режиме совместимости получает значения параметров отдельными аргументами.

Аналоги в классическом API — функции `GetModuleEvents` и `ExecuteModuleEventEx`.

Подробнее — в статье [События](../../../framework/events.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает событие с кодом модуля, именем, параметрами и фильтром | |
| [getModuleId](get-module-id.md) | Возвращает код модуля события | |
| [getEventType](get-event-type.md) | Возвращает имя события | |
| [getParameters](get-parameters.md) | Возвращает все параметры | |
| [setParameters](set-parameters.md) | Заменяет все параметры | |
| [getParameter](get-parameter.md) | Возвращает параметр по ключу | |
| [setParameter](set-parameter.md) | Записывает параметр по ключу | |
| [getFilter](get-filter.md) | Возвращает фильтр модулей обработчиков | |
| [setFilter](set-filter.md) | Задает фильтр модулей обработчиков | |
| [send](send.md) | Отправляет событие обработчикам | |
| [getSender](get-sender.md) | Возвращает отправителя события | |
| [getResults](get-results.md) | Возвращает результаты обработчиков | |
| [addResult](add-result.md) | Добавляет результат обработчика | |
| [getExceptions](get-exceptions.md) | Возвращает исключения обработчиков в режиме отладки | |
| [addException](add-exception.md) | Добавляет исключение обработчика | |
| [turnDebugOn](turn-debug-on.md) | Включает режим отладки | |
| [isDebugOn](is-debug-on.md) | Проверяет, включен ли режим отладки | |
| [getDebugInfo](get-debug-info.md) | Возвращает отладочные данные | |
| [addDebugInfo](add-debug-info.md) | Добавляет отладочные данные | |

## Наследование

### Реализации

| Класс | Собственные методы |
| --- | --- |
| [ORM\Event](../orm/event/index.md) | Методы для событий `add`, `update` и `delete` ORM — `getEntity`, `getErrors`, `mergeFields`, `mergeObjectFields`. Свой конструктор и метод `send`, который сначала вызывает одноименный метод класса ORM |

## Смотрите также

- [События](../../../framework/events.md)
- [EventManager](../event-manager/index.md)
- [EventResult](../event-result/index.md)
