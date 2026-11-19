---
title: Создать сущность на лету Entity::compileEntity
description: Статический метод Entity::compileEntity создает класс таблицы ORM во время выполнения и возвращает его сущность.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::compileEntity` создает класс таблицы во время выполнения и возвращает его сущность. Метод нужен, когда структура таблицы известна только во время работы, например для таблиц, которые создает пользователь, или для временных таблиц.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function compileEntity($entityName, $fields = null, $parameters = array())
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает имя сущности — латинские буквы, цифры и `_`. Метод добавит суффикс `Table` |
| fields | `array` или `null` | Задает поля — объекты полей или описания массивами. По умолчанию — `null` |
| parameters | `array` | Задает параметры класса, ключи перечислены в таблице ниже. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

| Ключ `parameters` | Значение |
| --- | --- |
| `namespace` | Пространство имен класса |
| `table_name` | Имя таблицы. Без ключа метод строит имя по пространству имен и имени сущности |
| `uf_id` | Объект пользовательских полей |
| `parent` | Родительский класс таблицы. По умолчанию — `DataManager` |
| `parent_map` | Значение `false` не берет поля родителя |
| `default_scope` | PHP-код тела метода `setDefaultScope($query)` |
| `object_parent` | Родительский класс объекта — наследник `EntityObject` |

## Возвращаемое значение

Метод возвращает объект `Entity`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Имя сущности или пространства имен содержит недопустимые символы |

## Особенности

- Метод создает класс через `eval`. Класс с тем же именем создать второй раз нельзя — PHP выдаст ошибку.
- Метод не создает таблицу в базе данных. Для этого вызовите [createDbTable](create-db-table.md).

## Примеры

**Пример.** Код создает сущность, таблицу и запись:

```php
<?php
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::compileEntity('DemoUnit', [
    new IntegerField('ID', ['primary' => true, 'autocomplete' => true]),
    new StringField('NAME', ['required' => true]),
], ['namespace' => 'Vendor\Units', 'table_name' => 'demo_api_units']);

$entity->createDbTable();

try
{
    $result = \Vendor\Units\DemoUnitTable::add(['NAME' => 'kg']);
    echo $entity->getDataClass() . ' ' . $result->getId();
}
finally
{
    $entity->getConnection()->dropTable('demo_api_units');
}
```

Код выведет `\Vendor\Units\DemoUnitTable 1`.

## Смотрите также

- [Entity::createDbTable](create-db-table.md)
- [Entity::getInstanceByQuery](get-instance-by-query.md)
