---
title: Преобразовать целое число для SQL SqlHelper::convertToDbInteger
description: Метод SqlHelper::convertToDbInteger приводит значение к целому числу в пределах размера колонки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToDbInteger` приводит значение к целому числу и ограничивает его пределами колонки заданного размера. Результат можно подставить в SQL без кавычек.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDbInteger($value, $size = 8)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение |
| size | `int` | Задает размер колонки в байтах. Для `2` метод ограничивает значение пределами от −32 768 до 32 767, для `4` — от −2 147 483 648 до 2 147 483 647. По умолчанию — `8`, без дополнительного ограничения |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает целое число `int`. Значение, которое выходит за пределы, метод заменяет ближайшим пределом.

## Примеры

**Пример.** Код приводит значения для колонки размером два байта:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

var_dump($helper->convertToDbInteger('15abc', 2), $helper->convertToDbInteger(100000, 2));
```

Код выведет `int(15)` и `int(32767)`.

## Смотрите также

- [SqlHelper::convertFromDbInteger](convert-from-db-integer.md)
