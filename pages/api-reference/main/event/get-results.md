---
title: Получить результаты обработчиков Event::getResults
description: Метод Event::getResults возвращает массив объектов EventResult, которые вернули обработчики события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getResults` возвращает результаты обработчиков события. Код, который отправил событие, проверяет результаты и решает, продолжать ли операцию.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getResults()
```

## Возвращаемое значение

Метод возвращает массив объектов [EventResult](../event-result/index.md) в порядке вызова обработчиков. Если обработчиков нет или ни один не вернул значение, метод возвращает пустой массив.

Класс `EventManager` оборачивает значение обработчика в `EventResult` с типом `UNDEFINED` и кодом модуля обработчика, если обработчик вернул не `EventResult`. Класс не добавляет в результаты пустые значения `null`, `false`, `0`, пустую строку и пустой массив. Строку `'0'` класс добавляет.

## Примеры

**Пример.** Код собирает данные из результатов всех обработчиков:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$eventManager = EventManager::getInstance();
$eventManager->addEventHandler(
    'vendor.units',
    'OnUnitListBuild',
    static function ()
    {
        return new EventResult(EventResult::SUCCESS, ['units' => ['kg', 'g']]);
    }
);
$eventManager->addEventHandler(
    'vendor.units',
    'OnUnitListBuild',
    static function ()
    {
        return new EventResult(EventResult::SUCCESS, ['units' => ['t']]);
    }
);

$event = new Event('vendor.units', 'OnUnitListBuild');
$event->send();

$units = [];
foreach ($event->getResults() as $result)
{
    if ($result->getType() === EventResult::SUCCESS)
    {
        $units = array_merge($units, $result->getParameters()['units']);
    }
}

echo implode(', ', $units);
```

Код выведет `kg, g, t`.

## Смотрите также

- [EventResult](../event-result/index.md)
- [Event::send](send.md)
