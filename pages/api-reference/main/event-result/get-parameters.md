---
title: Получить данные результата EventResult::getParameters
description: Метод EventResult::getParameters возвращает данные, которые обработчик события передал в результате.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventResult::getParameters` возвращает данные результата, например сообщение об ошибке или значения для кода, который отправил событие.

Сигнатура метода в классе `Bitrix\Main\EventResult`:

```php
public function getParameters()
```

## Возвращаемое значение

Метод возвращает значение параметра `parameters` конструктора или `null`, если данные не передали. Если обработчик вернул не `EventResult`, а другое значение, класс `EventManager` создает результат с этим значением, и метод возвращает его.

## Примеры

**Пример.** Обработчик возвращает строку, а не `EventResult`. Код читает строку из результата:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'main',
    'OnDemoUnitFormat',
    function ()
    {
        return 'kg';
    }
);

$event = new Event('main', 'OnDemoUnitFormat');
$event->send();

foreach ($event->getResults() as $result)
{
    var_dump($result->getType() === EventResult::UNDEFINED, $result->getParameters());
}
```

Код выведет `bool(true)` и `string(2) "kg"`.

## Смотрите также

- [EventResult::getType](get-type.md)
- [EventResult::__construct](construct.md)
