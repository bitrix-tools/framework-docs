---
title: Задать название таблицы DataManager::getTitle
description: Метод DataManager::getTitle возвращает название таблицы для людей. Наследник переопределяет его, если название нужно в интерфейсе.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getTitle` возвращает название таблицы для людей, например «Единицы измерения». Метод `getTitle` объекта [getEntity](get-entity.md) возвращает это название.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getTitle()
```

## Возвращаемое значение

Метод возвращает строку или `null`. Базовый класс возвращает `null`.

## Примеры

**Пример.** Код задает название таблицы и читает его через сущность:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_api_units';
    }

    public static function getTitle()
    {
        return 'Units of measure';
    }

    public static function getMap()
    {
        return [(new IntegerField('ID'))->configurePrimary()];
    }
}

echo DemoUnitTable::getEntity()->getTitle();
```

Код выведет `Units of measure`.

## Смотрите также

- [DataManager::getEntity](get-entity.md)
