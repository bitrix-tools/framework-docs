---
title: Проверить наличие сущности Entity::isExists
description: Статический метод Entity::isExists проверяет, есть ли класс таблицы сущности ORM. Работает как Entity::has.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::isExists` проверяет, есть ли класс таблицы сущности. Метод работает как [has](has.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function isExists($name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя сущности или класса таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если класс таблицы существует, иначе `false`.

## Примеры

**Пример.** Код проверяет сущность по имени класса таблицы:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Entity::isExists('Bitrix\Main\UserTable'));
```

Код выведет `bool(true)`.

## Смотрите также

- [Entity::has](has.md)
