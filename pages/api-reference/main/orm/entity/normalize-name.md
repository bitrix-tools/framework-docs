---
title: Привести имя к имени сущности Entity::normalizeName
description: Статический метод Entity::normalizeName убирает из имени суффикс Table и добавляет ведущий обратный слеш.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::normalizeName` приводит имя к полному имени сущности. Метод убирает суффикс `Table` и добавляет ведущий `\`. Метод выполняет обратное преобразование к [normalizeEntityClass](normalize-entity-class.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function normalizeName($entityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает имя сущности или класса таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает имя с ведущим `\` и без суффикса `Table`.

## Примеры

**Пример.** Код приводит два имени:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Entity::normalizeName('Vendor\Units\UnitTable') . ' ' . Entity::normalizeName('\Vendor\Units\Unit');
```

Код выведет `\Vendor\Units\Unit \Vendor\Units\Unit`.

## Смотрите также

- [Entity::normalizeEntityClass](normalize-entity-class.md)
