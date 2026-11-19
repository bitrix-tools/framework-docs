---
title: Создать результат EventResult::__construct
description: Конструктор EventResult создает результат обработчика события с типом, данными, кодом модуля и обработчиком.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `EventResult::__construct` создает результат обработчика события. Конструктор только сохраняет значения и не проверяет их.

Сигнатура метода в классе `Bitrix\Main\EventResult`:

```php
public function __construct($type, $parameters = null, $moduleId = null, $handler = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| type\* | `int` | Задает тип результата — константу `EventResult::UNDEFINED`, `EventResult::SUCCESS` или `EventResult::ERROR` |
| parameters | `mixed` | Задает данные результата, например массив с сообщением об ошибке. По умолчанию — `null` |
| moduleId | `string`, `null` | Задает код модуля обработчика. По умолчанию — `null` |
| handler | `mixed` | Задает обработчик или любое значение, по которому отправитель узнает источник результата. По умолчанию — `null` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Примеры

**Пример.** Обработчик проверяет код единицы измерения и возвращает ошибку. Код отправляет событие и выводит сообщение из результата:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'main',
    'OnDemoUnitCheck',
    function (Event $event)
    {
        if ($event->getParameter('code') === '')
        {
            return new EventResult(
                EventResult::ERROR,
                ['message' => 'Unit code is required'],
                'main'
            );
        }

        return new EventResult(EventResult::SUCCESS);
    }
);

$event = new Event('main', 'OnDemoUnitCheck', ['code' => '']);
$event->send();

foreach ($event->getResults() as $result)
{
    if ($result->getType() === EventResult::ERROR)
    {
        echo $result->getParameters()['message'];
    }
}
```

## Смотрите также

- [EventResult::getType](get-type.md)
- [EventResult::getParameters](get-parameters.md)
