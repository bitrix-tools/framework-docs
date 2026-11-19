---
title: Получить имя класса коллекции по умолчанию Entity::getDefaultCollectionClassName
description: Статический метод Entity::getDefaultCollectionClassName возвращает имя класса коллекции по умолчанию — EO_, имя сущности и _Collection.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::getDefaultCollectionClassName` возвращает имя класса коллекции по умолчанию — префикс `EO_`, имя сущности и суффикс `_Collection`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function getDefaultCollectionClassName($entityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает короткое имя сущности |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку без пространства имен.

## Примеры

**Пример.** Код строит имя класса коллекции:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Entity::getDefaultCollectionClassName('Unit');
```

Код выведет `EO_Unit_Collection`.

## Смотрите также

- [Entity::getDefaultObjectClassName](get-default-object-class-name.md)
