---
title: Создать класс коллекции Entity::compileCollectionClass
description: Статический метод Entity::compileCollectionClass создает класс коллекции сущности EO_<Сущность>_Collection, если его нет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::compileCollectionClass` создает класс коллекции сущности, если его нет. Класс получает имя из [getDefaultCollectionClassName](get-default-collection-class-name.md) и наследует [DataManager::getCollectionParentClass](../data/data-manager/get-collection-parent-class.md). Автозагрузчик ядра вызывает метод сам. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function compileCollectionClass($dataClass)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| dataClass\* | `string` | Задает класс таблицы или имя сущности |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает полное имя класса коллекции. Если класс уже есть, метод возвращает его имя и ничего не создает.

## Примеры

**Пример.** Код создает класс коллекции для сущности на лету:

```php
<?php
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Entity::compileEntity('DemoUnit', [new IntegerField('ID', ['primary' => true])], ['namespace' => 'Vendor\Units']);

echo Entity::compileCollectionClass('Vendor\Units\DemoUnit');
```

Код выведет `\Vendor\Units\EO_DemoUnit_Collection`.

## Смотрите также

- [Entity::compileObjectClass](compile-object-class.md)
