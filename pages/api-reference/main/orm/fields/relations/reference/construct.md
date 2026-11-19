---
title: Создать поле связи Reference::__construct
description: Конструктор Reference создает поле связи с именем, связанной ORM-сущностью и условием соединения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Reference::__construct` создает поле связи. Поле создают в методе `getMap` ORM-класса.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Relations\Reference`:

```php
public function __construct($name, $referenceEntity, $referenceFilter, $parameters = array())
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя поля связи, например `GROUP` |
| referenceEntity\* | `string`, `Bitrix\Main\ORM\Entity` | Задает связанную сущность — имя ORM-класса, например `DemoUnitGroupTable::class`, или объект сущности. Ведущая обратная косая черта и окончание `Table` в имени необязательны |
| referenceFilter\* | `Bitrix\Main\ORM\Query\Filter\ConditionTree`, `array` | Задает условие связи. Объект условия строит [Join::on](../../../query/join/on.md). Массив вида `['=this.GROUP_ID' => 'ref.ID']` — старый формат |
| parameters | `array` | Задает настройки в старом формате, например `['join_type' => 'INNER']`. По умолчанию — пустой массив. Для нового кода используйте методы `configure*` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Параметр `referenceFilter` пустой |

## Особенности

Конструктор принимает тип соединения из `parameters['join_type']` без учета регистра. Если тип неизвестен, конструктор оставляет `LEFT` без ошибки. Метод `configureJoinType` для неизвестного типа завершается ошибкой.

## Примеры

**Пример.** Код описывает две сущности — единицы измерения и группы единиц, связывает их полем `GROUP` по полю `GROUP_ID` и выводит имя связанной сущности и тип соединения:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitGroupTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_unit_group';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))->configurePrimary(),
            new StringField('NAME'),
        ];
    }
}

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
            new IntegerField('GROUP_ID'),
            (new Reference('GROUP', DemoUnitGroupTable::class, Join::on('this.GROUP_ID', 'ref.ID')))
                ->configureJoinType(Join::TYPE_INNER),
        ];
    }
}

$field = DemoUnitTable::getEntity()->getField('GROUP');

echo $field->getDataType() . ' ' . $field->getJoinType();
```

Код выведет `\DemoUnitGroup INNER`.

## Смотрите также

- [Join::on](../../../query/join/on.md)
- [Reference::getReference](get-reference.md)
