---
title: Получить код модуля события Event::getModuleId
description: Метод Event::getModuleId возвращает код модуля, который отправляет событие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getModuleId` возвращает код модуля, который передали в конструктор. Класс `EventManager` ищет обработчики по коду модуля и имени события.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getModuleId()
```

## Возвращаемое значение

Метод возвращает строку в том виде, в котором ее передали в конструктор.

## Примеры

**Пример.** Обработчик выводит код модуля и имя события, которое он получил:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'vendor.units',
    'OnUnitAdd',
    static function (Event $event)
    {
        echo $event->getModuleId() . ':' . $event->getEventType();
    }
);

(new Event('vendor.units', 'OnUnitAdd'))->send();
```

Код выведет `vendor.units:OnUnitAdd`.

## Смотрите также

- [Event::getEventType](get-event-type.md)
