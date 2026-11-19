---
title: Заменить объект EventManager::setInstance
description: Метод EventManager::setInstance заменяет объект, который возвращает getInstance, например наследником EventManager в тестах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::setInstance` заменяет объект, который возвращает [getInstance](get-instance.md). Метод подходит для тестов, где нужен наследник `EventManager` с другим поведением.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public static function setInstance($instance)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| instance\* | `Bitrix\Main\EventManager` | Задает объект `EventManager` или его наследника |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Если `instance` не объект `EventManager`, метод ничего не меняет и не выбрасывает исключение.

## Особенности

Новый объект не получает обработчики, которые добавили в прежний объект методом [addEventHandler](add-event-handler.md). Новый объект сам загрузит обработчики из базы данных.

## Примеры

**Пример.** Наследник `EventManager` считает отправленные события. Код подменяет объект, отправляет событие и в блоке `finally` возвращает прежний объект:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoCountingEventManager extends EventManager
{
    public int $sentCount = 0;

    public function __construct()
    {
        parent::__construct();
    }

    public function send(Event $event)
    {
        $this->sentCount++;
        parent::send($event);
    }
}

$previous = EventManager::getInstance();
$counting = new DemoCountingEventManager();

EventManager::setInstance($counting);
try
{
    (new Event('main', 'OnDemoUnitCheck'))->send();
    echo $counting->sentCount;
}
finally
{
    EventManager::setInstance($previous);
}
```

Код выведет `1`.

## Смотрите также

- [EventManager::getInstance](get-instance.md)
