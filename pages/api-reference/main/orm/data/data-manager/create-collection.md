---
title: Создать пустую коллекцию DataManager::createCollection
description: Метод DataManager::createCollection создает пустую коллекцию объектов ORM таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::createCollection` создает пустую коллекцию объектов таблицы, например `EO_User_Collection`. В коллекцию добавляют объекты методом `add` и сохраняют их одним вызовом `save`.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
final public static function createCollection()
```

## Возвращаемое значение

Метод возвращает пустую коллекцию класса из [getCollectionClass](get-collection-class.md).

## Примеры

**Пример.** Код собирает коллекцию из двух новых объектов и сохраняет ее. Блок `finally` удаляет рабочую таблицу:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Data\DataManager;
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

DemoUnitTable::getEntity()->createDbTable();

try
{
    $units = DemoUnitTable::createCollection();

    foreach (['kg', 'g'] as $code)
    {
        $unit = DemoUnitTable::createObject();
        $unit->setCode($code);
        $units->add($unit);
    }

    $units->save();

    echo count($units) . ' ' . DemoUnitTable::getCount();
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет `2 2`.

## Смотрите также

- [DataManager::wakeUpCollection](wake-up-collection.md)
- [Коллекции](../../../../../orm/collections.md)
