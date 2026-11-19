---
title: Отправить событие обработчикам EventManager::send
description: Метод EventManager::send вызывает обработчики события по порядку и записывает их результаты в объект события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::send` вызывает обработчики события и записывает их результаты в объект события. Метод `Event::send` сохраняет отправителя события и вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function send(Event $event)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| event\* | `Bitrix\Main\Event` | Задает событие. Метод берет из него код модуля, имя события и фильтр модулей обработчиков |

## Возвращаемое значение

Метод ничего не возвращает. Метод добавляет результаты обработчиков в событие, код читает их методом `Event::getResults`.

## Особенности

Метод получает обработчики через [findEventHandlers](find-event-handlers.md) и для каждого:

1. Подключает модуль обработчика, если это не `main`, или файл из `TO_PATH` или `includeFile`. Если модуль не подключился, метод пропускает обработчик.
2. Вызывает обработчик. Обработчик с `VERSION`, равным `2`, получает объект события. Обработчик режима совместимости получает значения параметров события отдельными аргументами.
3. Добавляет результат обработчика в событие. Если обработчик вернул не [EventResult](../event-result/index.md), метод оборачивает значение в `EventResult` с типом `UNDEFINED`. Пустые значения, например `null` и `false`, метод не добавляет.

Если класса обработчика из базы данных нет, метод не вызывает обработчик, но добавляет в событие `EventResult` с типом `UNDEFINED` и значением `true`.

Если обработчик выбросил исключение, метод передает его дальше. Если у события включен режим отладки методом `turnDebugOn`, метод сохраняет исключение класса `\Exception` в событии и продолжает со следующим обработчиком. Ошибки `\Error`, например `TypeError`, метод передает дальше и в режиме отладки.

## Примеры

**Пример.** Код отправляет событие через объект `EventManager` и выводит число результатов:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$eventManager = EventManager::getInstance();
$eventManager->addEventHandler(
    'main',
    'OnDemoUnitCheck',
    function ()
    {
        return new EventResult(EventResult::SUCCESS);
    }
);

$event = new Event('main', 'OnDemoUnitCheck');
$eventManager->send($event);

echo count($event->getResults());
```

Код выведет `1`.

## Смотрите также

- [EventManager::findEventHandlers](find-event-handlers.md)
- [EventResult](../event-result/index.md)
