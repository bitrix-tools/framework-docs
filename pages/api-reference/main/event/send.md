---
title: Отправить событие Event::send
description: Метод Event::send сохраняет отправителя события и вызывает обработчики через EventManager.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::send` отправляет событие обработчикам. Метод сохраняет отправителя и вызывает [EventManager::send](../event-manager/send.md). Страница `EventManager::send` описывает, в каком порядке метод вызывает обработчики, подключает их модули и собирает результаты.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function send($sender = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| sender | `mixed` | Задает отправителя события, например объект, который выполняет операцию. Обработчик получает его методом [getSender](get-sender.md). По умолчанию — `null` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Метод [getResults](get-results.md) возвращает результаты обработчиков.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| Исключение обработчика | Обработчик выбросил исключение. Метод не вызывает следующие обработчики, результаты предыдущих остаются в событии. В режиме отладки, который включает [turnDebugOn](turn-debug-on.md), метод сохраняет исключения класса `\Exception` в событии и продолжает со следующим обработчиком. Метод передает дальше ошибки `\Error` даже в режиме отладки |

## Особенности

Повторный вызов отправляет событие еще раз. Метод не очищает результаты, поэтому [getResults](get-results.md) вернет результаты обоих вызовов. Каждый вызов заменяет отправителя. Вызов без аргумента записывает `null`.

## Примеры

**Пример.** Модуль отправляет событие перед добавлением записи и отменяет операцию, если обработчик вернул ошибку:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'vendor.units',
    'OnBeforeUnitAdd',
    static function (Event $event)
    {
        if ($event->getParameter('code') === '')
        {
            return new EventResult(EventResult::ERROR, ['message' => 'Empty code']);
        }

        return new EventResult(EventResult::SUCCESS);
    }
);

$event = new Event('vendor.units', 'OnBeforeUnitAdd', ['code' => '']);
$event->send();

foreach ($event->getResults() as $result)
{
    if ($result->getType() === EventResult::ERROR)
    {
        echo 'Canceled: ' . $result->getParameters()['message'];
    }
}
```

Код выведет `Canceled: Empty code`.

## Смотрите также

- [EventManager::send](../event-manager/send.md)
- [Event::getResults](get-results.md)
- [События](../../../framework/events.md)
