---
title: Получить полное имя события Controller::getFullEventName
description: Статический метод Controller::getFullEventName возвращает имя события контроллера с именем класса, например Vendor\Unit::onBeforeAction.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Controller::getFullEventName` возвращает полное имя события контроллера — имя класса, `::` и короткое имя. Контроллер отправляет события `onBeforeAction` и `onAfterAction` модуля `main` с такими именами. Метод нужен, чтобы подписаться на события конкретного контроллера.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public static function getFullEventName($eventName): string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| eventName\* | `string` | Задает короткое имя события, например `Controller::EVENT_ON_BEFORE_ACTION` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку вида `<класс>::<имя события>`. Имя класса — полное имя класса, у которого вызвали метод.

## Особенности

Обработчик `onBeforeAction` отменяет действие, если возвращает `EventResult` с типом, отличным от `SUCCESS`.

## Примеры

**Пример.** Код подписывается на событие и запрещает действие:

```php
<?php
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['list' => ['prefilters' => []]];
    }

    public function listAction(): array
    {
        return ['kg'];
    }
}

EventManager::getInstance()->addEventHandler(
    'main',
    UnitController::getFullEventName(Controller::EVENT_ON_BEFORE_ACTION),
    static fn() => new EventResult(EventResult::ERROR, null, 'main')
);

$result = (new UnitController())->run('list', [[]]);

echo UnitController::getFullEventName(Controller::EVENT_ON_BEFORE_ACTION) . ' ' . var_export($result, true);
```

Код выведет `UnitController::onBeforeAction NULL`.

## Смотрите также

- [Controller::run](run.md)
