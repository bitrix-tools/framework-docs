---
title: Создать объект существующей записи DataManager::wakeUpObject
description: Метод DataManager::wakeUpObject создает объект ORM существующей записи по первичному ключу без запроса к базе данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::wakeUpObject` создает объект ORM для записи, которая уже есть в базе данных. Метод не выполняет запрос. Метод нужен, когда ключ записи известен, например из формы, и запись нужно изменить или удалить без предварительной выборки.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
final public static function wakeUpObject($row)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| row\* | `mixed` | Задает первичный ключ, например `1`, или массив значений полей с первичным ключом, например `['ID' => 1, 'CODE' => 'kg']` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект класса из [getObjectClass](get-object-class.md) в состоянии «актуальный». Объект содержит только переданные значения. Метод `fill` объекта загружает недостающие поля.

## Особенности

Метод не проверяет, что запись существует. Метод `save` такого объекта выполнит `UPDATE` и не добавит запись.

## Примеры

**Пример.** Код изменяет запись через объект без выборки. Блок `finally` удаляет рабочую таблицу:

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
            new StringField('NAME'),
        ];
    }
}

DemoUnitTable::getEntity()->createDbTable();

try
{
    $id = DemoUnitTable::add(['CODE' => 'kg'])->getId();

    $unit = DemoUnitTable::wakeUpObject($id);
    $before = var_export($unit->isCodeFilled(), true);
    $unit->setName('Kilogram');
    $unit->save();

    echo $before . ' ' . DemoUnitTable::getRowById($id)['NAME'];
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет `false Kilogram`.

## Смотрите также

- [DataManager::createObject](create-object.md)
- [DataManager::wakeUpCollection](wake-up-collection.md)
