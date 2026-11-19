---
title: Создать класс объекта Entity::compileObjectClass
description: Статический метод Entity::compileObjectClass создает класс объекта сущности EO_<Сущность>, если его нет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::compileObjectClass` создает класс объекта сущности, если его нет. Класс получает имя из [getDefaultObjectClassName](get-default-object-class-name.md) и наследует [DataManager::getObjectParentClass](../data/data-manager/get-object-parent-class.md). Автозагрузчик ядра вызывает метод сам при первом обращении к классу `EO_*`. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function compileObjectClass($dataClass)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| dataClass\* | `string` | Задает класс таблицы или имя сущности |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает полное имя класса объекта. Если класс уже есть, метод возвращает его имя и ничего не создает.

## Примеры

**Пример.** Код создает класс объекта для сущности на лету:

```php
<?php
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Entity::compileEntity('DemoUnit', [new IntegerField('ID', ['primary' => true])], ['namespace' => 'Vendor\Units']);
$class = Entity::compileObjectClass('Vendor\Units\DemoUnit');

echo $class . ' ' . var_export(class_exists($class, false), true);
```

Код выведет `\Vendor\Units\EO_DemoUnit true`.

## Смотрите также

- [Entity::compileCollectionClass](compile-collection-class.md)
