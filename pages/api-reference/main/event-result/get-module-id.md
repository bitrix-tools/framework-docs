---
title: Получить код модуля EventResult::getModuleId
description: Метод EventResult::getModuleId возвращает код модуля, который задали для результата обработчика события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventResult::getModuleId` возвращает код модуля обработчика. По коду модуля код, который отправил событие, определяет, какой модуль вернул результат.

Сигнатура метода в классе `Bitrix\Main\EventResult`:

```php
public function getModuleId()
```

## Возвращаемое значение

Метод возвращает значение параметра `moduleId` конструктора или `null`, если код не передали.

Если класс `EventManager` сам обернул значение обработчика в `EventResult`, он передает в конструктор код модуля из регистрации обработчика. У обработчика без кода модуля, например добавленного через `addEventHandler`, метод вернет `null`.

## Примеры

**Пример.** Код выводит модуль, который вернул ошибку:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'main',
    'OnDemoUnitCheck',
    function ()
    {
        return new EventResult(EventResult::ERROR, null, 'main');
    }
);

$event = new Event('main', 'OnDemoUnitCheck');
$event->send();

foreach ($event->getResults() as $result)
{
    if ($result->getType() === EventResult::ERROR)
    {
        echo $result->getModuleId();
    }
}
```

## Смотрите также

- [EventResult::getHandler](get-handler.md)
- [EventResult::__construct](construct.md)
