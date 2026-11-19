---
title: Сбросить кеш обработчиков EventManager::clearLoadedHandlers
description: Метод EventManager::clearLoadedHandlers очищает управляемый кеш обработчиков из базы данных и убирает их из памяти.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::clearLoadedHandlers` сбрасывает обработчики, загруженные из базы данных. При следующем поиске обработчиков класс снова прочитает их из базы данных. Методы регистрации и удаления регистрации вызывают метод сами, поэтому вызывать его нужно, только если таблицу регистраций изменили напрямую.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function clearLoadedHandlers()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод очищает управляемый кеш регистраций и убирает из памяти только обработчики из базы данных. Обработчики, добавленные методами [addEventHandler](add-event-handler.md) и [addEventHandlerCompatible](add-event-handler-compatible.md), остаются.

## Примеры

**Пример.** Код сбрасывает кеш и проверяет, что обработчик, добавленный в запросе, остался:

```php
<?php
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$eventManager = EventManager::getInstance();
$eventManager->addEventHandler(
    'main',
    'OnDemoUnitCreate',
    function ()
    {
    }
);

$eventManager->clearLoadedHandlers();

echo count($eventManager->findEventHandlers('main', 'OnDemoUnitCreate'));
```

Код выведет `1`.

## Смотрите также

- [EventManager::findEventHandlers](find-event-handlers.md)
