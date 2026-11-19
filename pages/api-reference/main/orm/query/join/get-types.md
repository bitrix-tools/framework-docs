---
title: Получить типы соединения Join::getTypes
description: Метод Join::getTypes возвращает список допустимых типов SQL-соединения для связей ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Join::getTypes` возвращает допустимые типы SQL-соединения. Метод `configureJoinType` поля связи сверяет тип с этим списком.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Join`:

```php
public static function getTypes()
```

## Возвращаемое значение

Метод возвращает массив значений констант `TYPE_INNER`, `TYPE_LEFT`, `TYPE_LEFT_OUTER`, `TYPE_RIGHT` и `TYPE_RIGHT_OUTER`, то есть строки `INNER`, `LEFT`, `LEFT OUTER`, `RIGHT` и `RIGHT OUTER`.

## Примеры

**Пример.** Код приводит тип соединения к верхнему регистру и проверяет, что тип допустим:

```php
<?php
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$joinType = strtoupper('inner');

var_dump(in_array($joinType, Join::getTypes(), true));
```

Код выведет `bool(true)`.

## Смотрите также

- [Join::on](on.md)
