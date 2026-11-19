---
title: Применить изменения полей к массиву Event::mergeFields
description: Метод ORM\Event::mergeFields удаляет и заменяет значения в массиве данных так, как задали обработчики события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.4

{% endnote %}

Метод `Event::mergeFields` применяет к массиву данных изменения, которые обработчики задали в результатах. Метод нужен коду, который хранит данные операции массивом. `DataManager` работает с объектом и вызывает [mergeObjectFields](merge-object-fields.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Event`:

```php
public function mergeFields(array $data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `array` | Задает исходные данные, ключи — имена полей |

## Возвращаемое значение

Метод возвращает массив данных после изменений. Метод обрабатывает результаты обработчиков по порядку. Для каждого результата метод:

1. Удаляет ключи из списка, который задали методами `unsetField` и `unsetFields` результата.
2. Добавляет и заменяет значения из массива, который задали методом `modifyFields`.

Если результатов нет, метод возвращает `data` без изменений. Метод не проверяет тип результата и применяет изменения в том числе из результата с ошибкой.

## Особенности

Метод вызывает `getUnset` и `getModified` у каждого результата. Эти методы есть только у `Bitrix\Main\ORM\EventResult`. Если обработчик вернул `Bitrix\Main\EventResult` или значение другого типа, PHP выбросит `\Error` о вызове несуществующего метода.

## Примеры

**Пример.** Обработчик переводит код в нижний регистр и убирает служебное поле. Код применяет изменения к массиву:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
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
        $fields = $event->getParameter('fields');

        $result = new EventResult();
        $result->modifyFields(['CODE' => strtolower($fields['CODE'])]);
        $result->unsetField('TMP_SOURCE');

        return $result;
    }
);

$fields = ['CODE' => 'KG', 'TMP_SOURCE' => 'import'];

$event = new Event(DemoUnitTable::getEntity(), DataManager::EVENT_ON_BEFORE_ADD, ['fields' => $fields], true);
$event->send();

print_r($event->mergeFields($fields));
```

Код выведет массив с одним ключом `CODE` и значением `kg`.

## Смотрите также

- [Event::mergeObjectFields](merge-object-fields.md)
- [Event::getErrors](get-errors.md)
