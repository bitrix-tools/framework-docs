---
title: Проверить приватное поле Query::isFieldPrivate
description: Статический метод Query::isFieldPrivate проверяет, приватное ли поле — скалярное поле с private или выражение на его основе.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Query::isFieldPrivate` проверяет, приватное ли поле. Метод считает приватным скалярное поле с `private` = `true` и выражение на основе приватного поля.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public static function isFieldPrivate($field)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `Bitrix\Main\ORM\Fields\Field` | Задает поле |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если поле приватное, иначе `false`. Для связей и других полей метод возвращает `false`.

## Примеры

**Пример.** Код проверяет поля пароля и логина:

```php
<?php
use Bitrix\Main\ORM\Query\Query;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = UserTable::getEntity();

var_dump(Query::isFieldPrivate($entity->getField('PASSWORD')), Query::isFieldPrivate($entity->getField('LOGIN')));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Query::enablePrivateFields](enable-private-fields.md)
