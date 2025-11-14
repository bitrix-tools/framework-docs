---
title: События
---

Событие -- это действие или изменение состояния системы, например, нажатие кнопки пользователем или завершение загрузки данных. События уведомляют части приложения об изменениях, что позволяет системе реагировать на них.

## Базовое использование

Для генерации события нужно использовать класс `Bitrix\Main\Event` и его метод `send`:
```php
$event = new \Bitrix\Main\Event('my.helpdesk', 'TicketClosed');
$event->send();
```

Обработчик может выглядеть таким образом:
```php
class TicketClosedEventHandler
{
    public static function handle(\Bitrix\Main\Event $event)
    {
        // обработка
    }
}
```

В случае если нам нужно передать какие-то дополнительные параметры, мы можем их указать в третьем аргументе:
```php
$event = new \Bitrix\Main\Event('my.helpdesk', 'TicketClosed', [
    'ticketId' => 123,
    'closeReason' => '...',
]);
$event->send();
```

Чтобы обработчике получить данные, нужно использовать методы `getParameter` и `getParameters`:
```php
class TicketClosedEventHandler
{
    public static function handle(\Bitrix\Main\Event $event)
    {
        $ticketId = $event->getParameter('ticketId');

        // или

        $params = $event->getParameters();
        $ticketId = $params['ticketId'];

        // обработка
    }
}
```

## Консольные команды

Для удобного создания событий и обработчиков, можно использовать CLI команды.

Пример создания события:
```bash
php bitrix.php make:event TicketClosed -m my.helpdesk --no-interaction
```

После чего будет создан файл `/local/modules/my.helpdesk/lib/Public/Event/TicketClosedEvent.php` с содержимым:
```php
namespace My\Helpdesk\Public\Event;

use Bitrix\Main\Event;

final class TicketClosedEvent extends Event
{
    public function __construct(
        public readonly int $ticketId,
        public readonly ?string $closeReason,
    )
    {
        parent::__construct(
            'my.helpdesk',
            'TicketClosed',
        );
    }
}
```

Далее уже для вызова события, мы можем использовать наш созданый класс, а не базовый:
```php
$event = new TicketClosedEvent(
    ticketId: 123,
    closeReason: '...',
);
$event->send();
```

Важно обратить внимаание, что в данном случае мы не использовали третий аргумент `parameters`, а передали полезную нагрузку как свойства нашего события.
Это облегчает работу с данными самого события.

Перейдём к созданию обработчика для нашего события:
```bash
php bitrix.php make:eventhandler TicketClosed --event-module my.helpdesk --handler-module my.helpdesk --no-interaction
```

После чего будет создан файл `local/modules/my.helpdesk/lib/Internals/Integration/My/Helpdesk/EventHandler/TicketClosedEventHandler.php` с содержимым:
```php
namespace My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler;

use Bitrix\Main\EventResult;

final class TicketClosedEventHandler
{
    public static function handle(TicketClosedEvent $event): EventResult
    {
        # process

        return new EventResult(EventResult::SUCCESS);
    }
}
```

В полученном коде НЕ генерируется полный путь до события, поэтому нужно указать его в аргументах метода `handle` или использовать конструкцию `use`.
И далее уже мы сможем использовать внутри обработчика свойства события:
```php
namespace My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler;

use Bitrix\Main\EventResult;
use My\Helpdesk\Public\Event\TicketClosedEvent;

final class TicketClosedEventHandler
{
    public static function handle(TicketClosedEvent $event): EventResult
    {
        $ticketId = $event->ticketId;
        $closeReason = $event->closeReason;

        // обработка

        return new EventResult(EventResult::SUCCESS);
    }
}
```

## Результаты событий

В примере выше, в обработчике можно заметить возвращаемое значение `Bitrix\Main\EventResult`.
Это необязательное условие для работы обработчика, можно вернуть `null` или ничего (в случае возвращаемого значения `void`) и обработка будет считаться успешно завершенной.
Но если вам необходимо добавить логику работы с результатами обработчика, можно использовать данный механизм.

Рассмотрим на примере события `BeforeTicketCloseEvent`, когда мы перед тем как закрыть тикет, планируем проверить, а можно ли это сделать.
Само событие будет выглядеть аналогичным образом:
```php
final class BeforeTicketCloseEvent extends Event
{
    public function __construct(
        public readonly int $ticketId,
        public readonly ?string $closeReason,
    )
    {
        parent::__construct(
            'my.helpdesk',
            'BeforeTicketClose',
        );
    }
}
```

А вот при вызове события, мы добавим дополнительную логику:
```php

use Bitrix\Main\Error;
use Bitrix\Main\EventResult;
use Bitrix\Main\Result;

final class TicketService
{
    public function close(int $ticketId, string $closeReason): Result
    {
        $result = new Result();

        $error = $this->canClose($ticketId, $closeReason);
        if ($error)
        {
            return $result->addError($error);
        }

        // обработка закрытия тикета

        return $result;
    }

    private function canClose(int $ticketId, string $closeReason): Error
    {
        $event = new BeforeTicketCloseEvent($ticketId, $closeReason);
        $event->send();

        foreach ($event->getResults() as $result)
        {
            if ($result->getType() === EventResult::ERROR)
            {
                return new Error(
                    (string)($result->getParameters()['message'] ?? 'Unknown'),
                );
            }
            elseif ($result->getType() === EventResult::SUCCESS)
            {
                // обработка успешного результата
            }
            elseif ($result->getType() === EventResult::UNDEFINED)
            {
                // обработка неопределенных ситуаций
            }
        }

        return null;
    }
}
```

Обработчик при такой логике, может выглядеть следующим образом:
```php
final class BeforeTicketCloseEventHandler
{
    public static function handle(BeforeTicketCloseEvent $event): EventResult
    {
        if (self::hasOpenTasks($event->ticketId))
        {
            return new EventResult(
                EventResult::ERROR,
                parameters: [
                    'message' => \Bitrix\Main\Localization\Loc::getMessage('TICKET_HAS_OPEN_TASKS'),
                ],
                moduleId: 'my.taskTracker',
            );
        }

        return new EventResult(EventResult::SUCCESS);
    }
}
```

## Регистрация обработчиков

Чтобы наши обработчики `BeforeTicketCloseEventHandler` и `TicketClosedEventHandler` начали собственно обрабатывать события, необходимо их зарегистрировать.
Сделать это можно с помощью объекта `Bitrix\Main\EventManager`:
```php
\Bitrix\Main\EventManager::getInstance()->registerEventHandler(
    fromModule: 'my.helpdesk',
    eventType: 'BeforeTicketClose',
    toModuleId: 'my.helpdesk',
    toClass: My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler\TicketClosedEventHandler::class,
    toMethod: 'handle',
);
```

Сделать это нужно 1 раз, т.к. зарегистрированные события хранятся в базе данныхю. Делать это рекомендовано при установке модуля.
При удалении модуля, зарегистрированные событие, нужно соответственно удалить:
```php
\Bitrix\Main\EventManager::getInstance()->unRegisterEventHandler(
    fromModule: 'my.helpdesk',
    eventType: 'BeforeTicketClose',
    toModuleId: 'my.helpdesk',
    toClass: My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler\TicketClosedEventHandler::class,
    toMethod: 'handle',
);
```

Если вам необходимо динамически добавить обработчиков событий, то можно использовать другой метод:
```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    fromModule: 'my.helpdesk',
    eventType: 'BeforeTicketClose',
    callback: '\My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler\TicketClosedEventHandler::handle',
);
```

**НЕ рекомендуется так делать, потому что динамическая регистрация событий усложняет отладку и анализ работы системы. В случае регистрации событий, они постоянно хранятся в одном месте и можно легко найти и посмотреть ВСЕ зарегистрированные события.**

## Старые события и режим совместимости

Все примеры выше относятся к текущей актуальной логике событий, но в продукте можно встретиться с событиями в старом формате, которые по тем или иным причинам до сих пор существуют в системе. Примером такого события является событие `OnBeforeUserAdd`.

При работе с данными событиями нет объекта события `Bitrix\Main\Event` и в обработчик передаётся **произвольный** набор аргументов, в зависимости от самого события:
```php
class OnBeforeUserAddEventHandler
{
    public static function handle(array &$fields): mixed
    {
        // обработка

        // результат в данном случае также не стандартизирован и будет менять в зависимости от обрабатываемого события
        return true;
    }
}
```

Регистрировать обработчики к данным событиям, нужно через метод `registerEventHandler`
```php
\Bitrix\Main\EventManager::getInstance()->registerEventHandlerCompatible(
    fromModule: 'main',
    eventType: 'OnBeforeUserAdd',
    toModuleId: 'my.testing',
    toClass: My\Testing\Internals\Integration\Main\EventHandler\OnBeforeUserAddEventHandler::class,
    toMethod: 'handle',
);
```

Для работы со старыми событиями используютя функции:
- `GetModuleEvents`
- `AddEventHandler`
- `ExecuteModuleEvent`
- `ExecuteModuleEventEx`

В случае если вы видите подобные вызовы у события, то вам **необходимо** обрабатывать их в режиме совместимости.
