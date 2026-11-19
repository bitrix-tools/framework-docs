---
title: Создать событие Event::__construct
description: Конструктор Event создает событие с кодом модуля, именем, параметрами и фильтром модулей обработчиков.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Event::__construct` создает событие. Конструктор только сохраняет аргументы, а метод [send](send.md) вызывает обработчики.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function __construct($moduleId, $type, $parameters = array(), $filter = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleId\* | `string` | Задает код модуля, который отправляет событие, например `main` или `vendor.units`. Класс `EventManager` сравнивает код с кодами обработчиков без учета регистра |
| type\* | `string` | Задает имя события, например `OnUnitAdd`. Класс `EventManager` сравнивает имя с именами обработчиков без учета регистра |
| parameters | `array` или `\Closure` | Задает параметры события массивом или замыканием, которое вернет массив. Событие вызывает замыкание при первом обращении к параметрам, в том числе при записи. По умолчанию — пустой массив |
| filter | `string`, `array` или `null` | Задает коды модулей, обработчики которых нужно вызвать. По умолчанию — `null`, событие вызывает все обработчики |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Аргумент `parameters` — не массив и не замыкание |

## Примеры

**Пример.** Код создает событие модуля, отправляет его и выводит число результатов:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'vendor.units',
    'OnUnitAdd',
    static function (Event $event)
    {
        return new EventResult(EventResult::SUCCESS);
    }
);

$event = new Event('vendor.units', 'OnUnitAdd', ['code' => 'kg']);
$event->send();

echo count($event->getResults());
```

Код выведет `1`.

## Смотрите также

- [Event::send](send.md)
- [Event::setFilter](set-filter.md)
- [События](../../../framework/events.md)
