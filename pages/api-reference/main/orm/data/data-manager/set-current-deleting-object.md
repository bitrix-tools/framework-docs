---
title: Передать удаляемый объект DataManager::setCurrentDeletingObject
description: Метод DataManager::setCurrentDeletingObject передает delete объект записи со значениями, чтобы обработчики событий удаления получили эти значения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::setCurrentDeletingObject` передает [delete](delete.md) объект записи, которую нужно удалить. Тогда `delete` передает обработчикам событий этот объект со значениями полей, а не новый объект только с первичным ключом. Метод `delete` объекта ORM вызывает этот метод сам. Прикладному коду метод нужен редко.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function setCurrentDeletingObject($object): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| object\* | `Bitrix\Main\ORM\Objectify\EntityObject` | Задает объект записи с первичным ключом |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод `delete` использует объект один раз и сбрасывает его после удаления с тем же первичным ключом, даже если удаление не удалось. Если `delete` вызван с другим ключом, объект останется в памяти и попадет к обработчикам при следующем удалении своей записи.

## Примеры

**Пример.** Код передает удаляемый объект, и обработчик события читает его код. Блок `finally` удаляет рабочую таблицу:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_api_units';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))->configurePrimary()->configureAutocomplete(),
            (new StringField('CODE'))->configureRequired(),
        ];
    }
}

EventManager::getInstance()->addEventHandler(
    DemoUnitTable::class,
    DataManager::EVENT_ON_AFTER_DELETE,
    function (Event $event)
    {
        echo 'deleted ' . $event->getParameter('object')->get('CODE');
    }
);

DemoUnitTable::getEntity()->createDbTable();

try
{
    $id = DemoUnitTable::add(['CODE' => 'kg'])->getId();

    DemoUnitTable::setCurrentDeletingObject(DemoUnitTable::wakeUpObject(['ID' => $id, 'CODE' => 'kg']));
    DemoUnitTable::delete($id);
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет `deleted kg`.

## Смотрите также

- [DataManager::delete](delete.md)
