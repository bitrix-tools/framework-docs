---
title: Получить тип результата EventResult::getType
description: Метод EventResult::getType возвращает тип результата обработчика события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventResult::getType` возвращает тип результата, который задали в конструкторе. По типу код, который отправил событие, отличает ошибку от успешного результата.

Сигнатура метода в классе `Bitrix\Main\EventResult`:

```php
public function getType()
```

## Возвращаемое значение

Метод возвращает значение, переданное в параметре `type` конструктора. Для типа класс объявляет константы `EventResult::UNDEFINED`, `EventResult::SUCCESS` и `EventResult::ERROR`. Если класс `EventManager` сам обернул значение обработчика в `EventResult`, метод возвращает `EventResult::UNDEFINED`.

## Примеры

**Пример.** Код считает, сколько обработчиков вернули ошибку:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$eventManager = EventManager::getInstance();
$eventManager->addEventHandler(
    'main',
    'OnDemoStatusCheck',
    function ()
    {
        return new EventResult(EventResult::SUCCESS);
    }
);
$eventManager->addEventHandler(
    'main',
    'OnDemoStatusCheck',
    function ()
    {
        return new EventResult(EventResult::ERROR);
    }
);

$event = new Event('main', 'OnDemoStatusCheck');
$event->send();

$errorCount = 0;
foreach ($event->getResults() as $result)
{
    if ($result->getType() === EventResult::ERROR)
    {
        $errorCount++;
    }
}

echo $errorCount;
```

Код выведет `1`.

## Смотрите также

- [EventResult::__construct](construct.md)
- [EventResult::getParameters](get-parameters.md)
