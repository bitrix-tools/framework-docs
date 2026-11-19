---
title: Перенести ошибки обработчиков в результат Event::getErrors
description: Метод ORM\Event::getErrors добавляет ошибки из результатов обработчиков в результат операции ORM и возвращает true, если ошибки есть.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.4

{% endnote %}

Метод `Event::getErrors` проверяет результаты обработчиков события и переносит ошибки в результат операции. `DataManager` вызывает метод после событий `OnBeforeAdd`, `OnBeforeUpdate` и `OnBeforeDelete`, поэтому ошибка обработчика прерывает операцию.

Сигнатура метода в классе `Bitrix\Main\ORM\Event`:

```php
public function getErrors(Result $result)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| result\* | `Bitrix\Main\ORM\Data\Result` | Задает результат операции, в который метод добавит ошибки |

## Возвращаемое значение

Метод возвращает `true`, если хотя бы один результат обработчика имеет тип `EventResult::ERROR`. Иначе метод возвращает `false`.

Метод берет ошибки только из результатов с типом `EventResult::ERROR` и добавляет их в `result` методом `addErrors`.

## Особенности

Метод вызывает `getErrors` у каждого результата с типом `EventResult::ERROR`. Такой метод есть только у `Bitrix\Main\ORM\EventResult`. Если обработчик вернул `Bitrix\Main\EventResult` с типом `ERROR`, PHP выбросит `\Error` о вызове несуществующего метода.

## Примеры

**Пример.** Обработчик запрещает пустой код единицы измерения. Код отправляет событие и выводит ошибку из результата:

```php
<?php
use Bitrix\Main\ORM\Data\AddResult;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\EntityError;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;
use Bitrix\Main\ORM\EventResult;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_unit';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))->configurePrimary(),
            new StringField('CODE'),
        ];
    }
}

EventManager::getInstance()->addEventHandler(
    DemoUnitTable::class,
    DataManager::EVENT_ON_BEFORE_ADD,
    function (Event $event)
    {
        $result = new EventResult();
        if (($event->getParameter('fields')['CODE'] ?? '') === '')
        {
            $result->addError(new EntityError('Unit code is required'));
        }

        return $result;
    }
);

$event = new Event(DemoUnitTable::getEntity(), DataManager::EVENT_ON_BEFORE_ADD, ['fields' => ['CODE' => '']], true);
$event->send();

$addResult = new AddResult();
if ($event->getErrors($addResult))
{
    echo implode(', ', $addResult->getErrorMessages());
}
```

## Смотрите также

- [Event::mergeFields](merge-fields.md)
- [Event::mergeObjectFields](merge-object-fields.md)
