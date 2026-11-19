---
title: Создать объект новой записи DataManager::createObject
description: Метод DataManager::createObject создает объект ORM для новой записи со значениями по умолчанию. Метод save объекта сохраняет его.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::createObject` создает объект ORM для новой записи, например `EO_User`. Сеттеры `set*` задают значения. Метод `save` объекта добавляет запись.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
final public static function createObject($setDefaultValues = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| setDefaultValues | `bool` или `array` | Значение `true` заполняет поля значениями по умолчанию из `configureDefaultValue`. Массив `поле => значение` задает свои значения вместо значений по умолчанию, остальные поля метод заполняет из описания полей. По умолчанию — `true` |

Типы в таблице описывают назначение аргумента. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект класса из [getObjectClass](get-object-class.md).

## Примеры

**Пример.** Код создает объект, сохраняет его и получает идентификатор. Блок `finally` удаляет рабочую таблицу:

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
            (new StringField('NAME'))->configureDefaultValue('Unnamed'),
        ];
    }
}

DemoUnitTable::getEntity()->createDbTable();

try
{
    $unit = DemoUnitTable::createObject();
    $unit->setCode('kg');
    $result = $unit->save();

    echo $result->isSuccess() . ' ' . $unit->getId() . ' ' . $unit->getName();
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет `1 1 Unnamed`.

## Смотрите также

- [DataManager::wakeUpObject](wake-up-object.md)
- [Объекты](../../../../../orm/objects.md)
