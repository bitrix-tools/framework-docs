---
title: Зарегистрировать обработчик EventManager::registerEventHandler
description: Метод EventManager::registerEventHandler сохраняет обработчик события в базе данных, обработчик получает объект Bitrix\Main\Event.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::registerEventHandler` сохраняет обработчик события в базе данных. Регистрация действует, пока ее не удалит [unRegisterEventHandler](un-register-event-handler.md). Вызовите метод один раз в установщике модуля. Обработчик получает объект события `Bitrix\Main\Event`.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function registerEventHandler($fromModuleId, $eventType, $toModuleId, $toClass = '', $toMethod = '', $sort = 100, $toPath = '', $toMethodArg = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fromModuleId\* | `string` | Задает код модуля, который отправляет событие |
| eventType\* | `string` | Задает имя события |
| toModuleId\* | `string` | Задает код модуля обработчика. Перед вызовом обработчика метод `send` подключает этот модуль, если это не `main` |
| toClass | `string` | Задает имя класса обработчика. По умолчанию — пустая строка |
| toMethod | `string` | Задает имя статического метода обработчика. По умолчанию — пустая строка |
| sort | `int` | Задает порядок вызова. Метод `send` вызывает обработчик с меньшим значением раньше. По умолчанию — `100` |
| toPath | `string` | Задает путь к файлу относительно каталога `/local/` или `/bitrix/`. Если `toModuleId` пустой или `main`, метод `send` ищет файл сначала в `/local/`, затем в `/bitrix/` и подключает его перед вызовом. По умолчанию — пустая строка |
| toMethodArg | `array` | Задает аргументы, которые метод `send` передаст обработчику перед объектом события. По умолчанию — пустой массив |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод вычисляет уникальный ключ записи из всех параметров, кроме `sort`, и из версии обработчика. Если запись с таким ключом уже есть, метод не добавляет повторную запись. Поэтому повторная регистрация с другим `sort` не меняет сортировку. Регистрации одного обработчика через этот метод и через [registerEventHandlerCompatible](register-event-handler-compatible.md) — две разные записи.

Если метод добавил запись, он сбрасывает кеш обработчиков методом [clearLoadedHandlers](clear-loaded-handlers.md).

Метод `send` вызывает обработчик, только если модуль `toModuleId` установлен. Метод [findEventHandlers](find-event-handlers.md) читает регистрации вместе с таблицей модулей.

## Примеры

**Пример.** Код регистрирует статический метод класса обработчиком своего события, отправляет событие и в блоке `finally` удаляет регистрацию:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoUnitHandler
{
    public static function onCreate(Event $event): void
    {
        echo 'Created unit ' . $event->getParameter('code');
    }
}

$eventManager = EventManager::getInstance();
$eventManager->registerEventHandler('main', 'OnDemoUnitCreate', 'main', DemoUnitHandler::class, 'onCreate');

try
{
    (new Event('main', 'OnDemoUnitCreate', ['code' => 'kg']))->send();
}
finally
{
    $eventManager->unRegisterEventHandler('main', 'OnDemoUnitCreate', 'main', DemoUnitHandler::class, 'onCreate');
}
```

Код выведет `Created unit kg`.

## Смотрите также

- [EventManager::unRegisterEventHandler](un-register-event-handler.md)
- [EventManager::registerEventHandlerCompatible](register-event-handler-compatible.md)
- [События](../../../framework/events.md)
