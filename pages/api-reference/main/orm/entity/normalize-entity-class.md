---
title: Привести имя к классу таблицы Entity::normalizeEntityClass
description: Статический метод Entity::normalizeEntityClass добавляет к имени сущности суффикс Table и ведущий обратный слеш.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::normalizeEntityClass` приводит имя к классу таблицы. Метод добавляет суффикс `Table`, если его нет, и ведущий `\`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function normalizeEntityClass($entityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает имя сущности или класса таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает имя класса таблицы, например `\Vendor\Units\UnitTable`.

## Особенности

Метод сравнивает суффикс без учета регистра, поэтому для имени `Vendor\Units\Unittable` метод не добавит суффикс и вернет `\Vendor\Units\Unittable`.

## Примеры

**Пример.** Код приводит два имени:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Entity::normalizeEntityClass('Vendor\Units\Unit') . ' ' . Entity::normalizeEntityClass('\Vendor\Units\UnitTable');
```

Код выведет `\Vendor\Units\UnitTable \Vendor\Units\UnitTable`.

## Смотрите также

- [Entity::normalizeName](normalize-name.md)
