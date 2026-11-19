---
title: Включить режим отладки Event::turnDebugOn
description: Метод Event::turnDebugOn включает режим отладки события. Событие собирает исключения обработчиков и данные о вызовах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::turnDebugOn` включает режим отладки события. Вызывайте метод до [send](send.md).

В режиме отладки класс `EventManager` меняет поведение:

- сохраняет исключения обработчиков класса `\Exception` в событии и вызывает следующие обработчики, а не передает исключение дальше,
- записывает в событие описание каждого обработчика, результат подключения его модуля и значение, которое вернул обработчик.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function turnDebugOn()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

У класса нет метода, который выключает режим отладки.

## Примеры

**Пример.** Код отправляет событие в режиме отладки, первый обработчик выбрасывает исключение, второй выполняется:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\SystemException;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$eventManager = EventManager::getInstance();
$eventManager->addEventHandler(
    'vendor.units',
    'OnUnitAdd',
    static function ()
    {
        throw new SystemException('Handler failed');
    }
);
$eventManager->addEventHandler(
    'vendor.units',
    'OnUnitAdd',
    static function ()
    {
        return 'second';
    }
);

$event = new Event('vendor.units', 'OnUnitAdd');
$event->turnDebugOn();
$event->send();

echo count($event->getExceptions()) . ' ' . count($event->getResults());
```

Код выведет `1 1`.

## Смотрите также

- [Event::getExceptions](get-exceptions.md)
- [Event::getDebugInfo](get-debug-info.md)
