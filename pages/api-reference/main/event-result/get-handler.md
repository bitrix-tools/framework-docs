---
title: Получить обработчик EventResult::getHandler
description: Метод EventResult::getHandler возвращает обработчик, который передали в конструктор результата события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventResult::getHandler` возвращает значение параметра `handler` конструктора. В этом параметре разработчик передает любое значение, например имя класса обработчика.

Сигнатура метода в классе `Bitrix\Main\EventResult`:

```php
public function getHandler()
```

## Возвращаемое значение

Метод возвращает значение параметра `handler` конструктора или `null`, если его не передали. Класс `EventManager` не заполняет этот параметр, в том числе когда сам создает `EventResult` из значения обработчика.

## Примеры

**Пример.** Обработчик передает в результат строку-метку. Код выводит ее:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'main',
    'OnDemoUnitCheck',
    function ()
    {
        return new EventResult(EventResult::SUCCESS, null, 'main', 'demoUnitChecker');
    }
);

$event = new Event('main', 'OnDemoUnitCheck');
$event->send();

foreach ($event->getResults() as $result)
{
    echo $result->getHandler();
}
```

## Смотрите также

- [EventResult::getModuleId](get-module-id.md)
- [EventResult::__construct](construct.md)
