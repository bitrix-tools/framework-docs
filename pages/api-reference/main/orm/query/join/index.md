---
title: Join — условие и типы соединения для связей ORM
description: Класс Bitrix\Main\ORM\Query\Join строит условие связи для поля Reference и хранит типы SQL-соединения.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Query`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `Join` строит условия связей в методе `getMap` и хранит типы SQL-соединения. Метод [on](on.md) строит условие связи для поля [Reference](../../fields/relations/reference/index.md), а константы `TYPE_*` задают тип SQL-соединения в методе `configureJoinType`. Все методы класса статические.

Старое имя класса `Bitrix\Main\Entity\Query\Join` работает как псевдоним.

Подробнее о связях — в статье [Связи между сущностями](../../../../../orm/entity-relations.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [on](on.md) | Создает условие связи, которое сравнивает два поля | |
| [getTypes](get-types.md) | Возвращает допустимые типы соединения | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `TYPE_INNER` | `INNER` | Соединение `INNER JOIN` |
| `TYPE_LEFT` | `LEFT` | Соединение `LEFT JOIN`. Тип по умолчанию у поля `Reference` |
| `TYPE_LEFT_OUTER` | `LEFT OUTER` | Соединение `LEFT OUTER JOIN` |
| `TYPE_RIGHT` | `RIGHT` | Соединение `RIGHT JOIN` |
| `TYPE_RIGHT_OUTER` | `RIGHT OUTER` | Соединение `RIGHT OUTER JOIN` |

## Смотрите также

- [Reference](../../fields/relations/reference/index.md)
- [Связи между сущностями](../../../../../orm/entity-relations.md)
