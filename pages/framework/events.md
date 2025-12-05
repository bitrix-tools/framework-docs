---
title: События
description: 'События. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Событие -- это действие или изменение состояния системы, например, нажатие кнопки пользователем или завершение загрузки данных. События уведомляют части приложения об изменениях, что позволяет системе реагировать на них.

## Базовое использование

Чтобы создать и отправить событие, используйте класс `Bitrix\Main\Event` и его метод `send`.

Пример отправки события:

```php
$event = new \Bitrix\Main\Event('my.helpdesk', 'TicketClosed');
$event->send();
```

Пример обработчика для этого события:

```php
class TicketClosedEventHandler
{
    public static function handle(\Bitrix\Main\Event $event)
    {
        // Код для обработки события
    }
}
```

Если нужно передать дополнительные параметры, укажите их третьим аргументом:

```php
$event = new \Bitrix\Main\Event('my.helpdesk', 'TicketClosed', [
    'ticketId' => 123,
    'closeReason' => '...',
]);
$event->send();
```

Чтобы обработчик получил данные, используйте методы `getParameter` и `getParameters`:

```php
class TicketClosedEventHandler
{
    public static function handle(\Bitrix\Main\Event $event)
    {
        // Получить один параметр
        $ticketId = $event->getParameter('ticketId');
        // Получить все параметры
        $params = $event->getParameters();
        $ticketId = $params['ticketId'];

        // Обработка события
    }
}
```

## Консольные команды

Bitrix Framework предоставляет CLI-команды для удобной работы с событиями.

### Создание события

Чтобы создать событие, используйте команду `make:event`.

Пример создания события:

```bash
php bitrix.php make:event TicketClosed -m my.helpdesk --no-interaction
```

Эта команда создаст файл `/local/modules/my.helpdesk/lib/Public/Event/TicketClosedEvent.php`:

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

Теперь для отправки события можно использовать созданный класс, а не базовый:

```php
$event = new TicketClosedEvent(
    ticketId: 123,
    closeReason: '...',
);
$event->send();
```

{% note info "" %}

Данные передаются как свойства события, а не через массив параметров. Это облегчает работу с данными.

{% endnote %}

### Создание обработчика

Чтобы создать обработчик, используйте команду `make:eventhandler`.

Пример создания обработчика:

```bash
php bitrix.php make:eventhandler TicketClosed --event-module my.helpdesk --handler-module my.helpdesk --no-interaction
```

Эта команда создаст файл `local/modules/my.helpdesk/lib/Internals/Integration/My/Helpdesk/EventHandler/TicketClosedEventHandler.php`:

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

{% note info "" %}

В сгенерированном коде нет полного пути к классу события. Нужно указать его в аргументах метода `handle` или использовать конструкцию `use`.

{% endnote %}

Теперь свойства события можно использовать внутри обработчика:

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

        // Обработка события

        return new EventResult(EventResult::SUCCESS);
    }
}
```

## Результаты событий

Обработчик события может возвращать результат. Это необязательно -- можно вернуть `null` или ничего для методов с типом `void`. Если обработчик должен повлиять на дальнейшую логику выполнения, например, запретить операцию или передать дополнительные параметры, используйте `Bitrix\Main\EventResult`.

В качестве примера рассмотрим событие `BeforeTicketCloseEvent`. Оно вызывается перед закрытием тикета и позволяет обработчикам проверить, можно ли выполнить операцию. Если любой из обработчиков вернет ошибку, процесс закрытия прервется.

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

Проверка перед закрытием тикета:

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

        // Код для закрытия тикета

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
                // Обработка успешного результата
            }
            elseif ($result->getType() === EventResult::UNDEFINED)
            {
                // Обработка неопределенного результата
            }
        }

        return null;
    }
}
```

Пример обработчика, который возвращает ошибку:

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

Чтобы обработчики `BeforeTicketCloseEventHandler` и `TicketClosedEventHandler` начали работать, их нужно зарегистрировать. Используйте для этого объект `Bitrix\Main\EventManager` и его метод `registerEventHandler`:

```php
\Bitrix\Main\EventManager::getInstance()->registerEventHandler(
    fromModule: 'my.helpdesk',
    eventType: 'BeforeTicketClose',
    toModuleId: 'my.helpdesk',
    toClass: My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler\TicketClosedEventHandler::class,
    toMethod: 'handle',
);
```

Регистрируйте обработчики один раз при установке модуля. Они хранятся в базе данных.

При удалении модуля удаляйте обработчики с помощью метода `unRegisterEventHandler`:

```php
\Bitrix\Main\EventManager::getInstance()->unRegisterEventHandler(
    fromModule: 'my.helpdesk',
    eventType: 'BeforeTicketClose',
    toModuleId: 'my.helpdesk',
    toClass: My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler\TicketClosedEventHandler::class,
    toMethod: 'handle',
);
```

Есть также способ добавить обработчик динамически через метод `addEventHandler`:

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    fromModule: 'my.helpdesk',
    eventType: 'BeforeTicketClose',
    callback: '\My\Helpdesk\Internals\Integration\My\Helpdesk\EventHandler\TicketClosedEventHandler::handle',
);
```

{% note warning "" %}

Не рекомендуется использовать динамическую регистрацию. Она усложняет отладку и анализ системы. Постоянная регистрация в одном месте позволяет легко найти все обработчики событий.

{% endnote %}

## Старые события и режим совместимости

В продукте есть события в старом формате, например `OnBeforeUserAdd`. У них нет объекта `Bitrix\Main\Event`, и в обработчик передается произвольный набор аргументов.

Пример обработчика для старого события:

```php
class OnBeforeUserAddEventHandler
{
    public static function handle(array &$fields): mixed
    {
        // Обработка события

        // Результат зависит от конкретного события
        return true;
    }
}
```

Для регистрации используйте метод `registerEventHandlerCompatible`:

```php
\Bitrix\Main\EventManager::getInstance()->registerEventHandlerCompatible(
    fromModule: 'main',
    eventType: 'OnBeforeUserAdd',
    toModuleId: 'my.testing',
    toClass: My\Testing\Internals\Integration\Main\EventHandler\OnBeforeUserAddEventHandler::class,
    toMethod: 'handle',
);
```

Для работы со старыми событиями используются функции:

-  `GetModuleEvents`

-  `AddEventHandler`

-  `ExecuteModuleEvent`

-  `ExecuteModuleEventEx`

Если вы видите эти функции в коде, обрабатывайте события в режиме совместимости.
