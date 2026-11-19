---
title: Разделить имя на части Entity::getEntityClassParts
description: Статический метод Entity::getEntityClassParts делит имя сущности на пространство имен и короткое имя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::getEntityClassParts` делит имя сущности на пространство имен и короткое имя без суффикса `Table`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function getEntityClassParts($class)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| class\* | `string` | Задает имя сущности или класса таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив с ключами `namespace` — без ведущего `\` — и `name`. Для класса без пространства имен `namespace` — пустая строка.

## Примеры

**Пример.** Код делит два имени:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo json_encode([Entity::getEntityClassParts('Vendor\Units\UnitTable'), Entity::getEntityClassParts('Unit')]);
```

Код выведет `[{"namespace":"Vendor\\Units","name":"Unit"},{"namespace":"","name":"Unit"}]`.

## Смотрите также

- [Entity::normalizeEntityClass](normalize-entity-class.md)
