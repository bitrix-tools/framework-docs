---
title: Дополнить сущность после создания DataManager::postInitialize
description: ORM вызывает метод DataManager::postInitialize один раз после создания сущности. Наследник переопределяет его, чтобы добавить поля, которые нельзя описать в getMap.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::postInitialize` дополняет сущность после создания. ORM вызывает его один раз, когда создает сущность и поля из [getMap](get-map.md). Наследник переопределяет метод, чтобы добавить поля, которые зависят от уже созданных полей или от настроек сайта.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function postInitialize(Entity $entity)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entity\* | `Bitrix\Main\ORM\Entity` | Задает созданную сущность. Метод может добавить в нее поля методом `addField` |

## Возвращаемое значение

Базовый класс возвращает `null`. ORM не использует возвращаемое значение.

## Примеры

**Пример.** Код добавляет в сущность поле-выражение после создания:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\ExpressionField;
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
            (new IntegerField('ID'))->configurePrimary(),
            new StringField('CODE'),
        ];
    }

    public static function postInitialize(Entity $entity)
    {
        $entity->addField(new ExpressionField('CODE_LENGTH', 'LENGTH(%s)', 'CODE'));
    }
}

var_dump(DemoUnitTable::getEntity()->hasField('CODE_LENGTH'));
```

Код выведет `bool(true)`.

## Смотрите также

- [DataManager::getMap](get-map.md)
