---
title: Применить изменения полей к объекту Event::mergeObjectFields
description: Метод ORM\Event::mergeObjectFields удаляет и устанавливает значения полей объекта ORM так, как задали обработчики события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::mergeObjectFields` применяет к объекту ORM изменения, которые обработчики задали в результатах. `DataManager` вызывает метод после событий `OnBeforeAdd` и `OnBeforeUpdate`, поэтому изменения обработчика попадают в базу данных.

Сигнатура метода в классе `Bitrix\Main\ORM\Event`:

```php
public function mergeObjectFields(EntityObject $object)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| object\* | `Bitrix\Main\ORM\Objectify\EntityObject` | Задает объект ORM, который метод изменит |

## Возвращаемое значение

Метод ничего не возвращает и меняет переданный объект. Метод обрабатывает результаты обработчиков по порядку. Для каждого результата метод:

1. Сбрасывает значения полей из списка, который задали методами `unsetField` и `unsetFields` результата. Метод пропускает имена, которых нет среди полей сущности.
2. Устанавливает значения из массива, который задали методом `modifyFields`.

Метод не проверяет тип результата и применяет изменения в том числе из результата с ошибкой.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | В массиве `modifyFields` есть поле, которого нет в сущности, или для поля-связи передан объект другого класса |
| `Bitrix\Main\SystemException` | В массиве `modifyFields` есть поле, которое нельзя изменить, — первичный ключ сохраненного объекта, вычисляемое поле или runtime-поле объекта |

## Особенности

Метод вызывает `getUnset` и `getModified` у каждого результата. Эти методы есть только у `Bitrix\Main\ORM\EventResult`. Если обработчик вернул `Bitrix\Main\EventResult` или значение другого типа, PHP выбросит `\Error` о вызове несуществующего метода.

## Примеры

**Пример.** Обработчик переводит код в нижний регистр. Код применяет изменение к новому объекту без записи в базу данных:

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
        $object = $event->getParameter('object');

        $result = new EventResult();
        $result->modifyFields(['CODE' => strtolower($object->get('CODE'))]);

        return $result;
    }
);

$unit = DemoUnitTable::createObject();
$unit->set('CODE', 'KG');

$event = new Event(DemoUnitTable::getEntity(), DataManager::EVENT_ON_BEFORE_ADD, ['object' => $unit], true);
$event->send();
$event->mergeObjectFields($unit);

echo $unit->get('CODE');
```

Код выведет `kg`.

## Смотрите также

- [Event::mergeFields](merge-fields.md)
- [Изменить данные перед сохранением](../../../../orm/entity-operations.md#modify-fields)
