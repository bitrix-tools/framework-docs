---
title: Получить отправителя события Event::getSender
description: Метод Event::getSender возвращает отправителя, которого передали в Event::send.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getSender` возвращает отправителя события — значение, которое передали в [send](send.md). Через отправителя обработчик получает, например, объект, который выполняет операцию, или строку с источником операции.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getSender()
```

## Возвращаемое значение

Метод возвращает значение аргумента `sender` последнего вызова `send`. До отправки и при вызове `send` без аргумента метод возвращает `null`.

## Примеры

**Пример.** Обработчик читает отправителя события:

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
        echo 'sender: ' . $event->getSender();
    }
);

(new Event('vendor.units', 'OnUnitAdd'))->send('unit-import');
```

Код выведет `sender: unit-import`.

## Смотрите также

- [Event::send](send.md)
