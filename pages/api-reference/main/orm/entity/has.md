---
title: Проверить наличие сущности Entity::has
description: Статический метод Entity::has проверяет, есть ли класс таблицы сущности ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::has` проверяет, есть ли класс таблицы сущности. Метод нужен перед [get](get.md), если сущность может отсутствовать, например когда модуль не установлен.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function has($entityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает имя сущности или класса таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если класс таблицы существует, иначе `false`.

## Особенности

Метод проверяет класс через `class_exists` и вызывает автозагрузку. Класс модуля найдется, только если модуль подключен.

## Примеры

**Пример.** Код проверяет две сущности:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Entity::has('Bitrix\Main\Localization\Language'), Entity::has('Vendor\Units\Unit'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Entity::isExists](is-exists.md)
- [Entity::get](get.md)
