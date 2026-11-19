---
title: Описать поля DataManager::getMap
description: Метод DataManager::getMap возвращает описание полей таблицы. Наследник переопределяет его и перечисляет поля объектами Field.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

Метод `DataManager::getMap` возвращает описание полей таблицы — колонок, связей и выражений. Наследник переопределяет метод. ORM читает описание один раз, когда создает сущность.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getMap()
```

## Возвращаемое значение

Метод возвращает массив объектов полей, например `IntegerField`, `StringField`, `DatetimeField`, `Reference` или `ExpressionField`. Базовый класс возвращает пустой массив.

## Особенности

- Метод возвращает описание, а не готовые поля сущности. Методы `getFields` и `getField` объекта из [getEntity](get-entity.md) возвращают поля, привязанные к сущности.
- Старый формат — массив `имя поля => массив параметров` с ключом `data_type`. Для нового кода используйте объекты полей и методы `configure*`.

## Примеры

**Пример.** Код описывает таблицу единиц и выводит ее поля:

```php
<?php
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

echo implode(',', array_keys(DemoUnitTable::getEntity()->getFields()));
```

Код выведет `ID,CODE,NAME`.

## Смотрите также

- [DataManager::getTableName](get-table-name.md)
- [ExpressionField](../../fields/expression-field/index.md)
- [DatetimeField](../../fields/datetime-field/index.md)
