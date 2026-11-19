---
title: Оставить положительные целые числа Collection::normalizeArrayValuesByInt
description: Метод Collection::normalizeArrayValuesByInt приводит значения массива к целым числам и оставляет уникальные положительные.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.4

{% endnote %}

Метод `Collection::normalizeArrayValuesByInt` приводит значения массива к целым числам и оставляет только уникальные числа больше нуля. Метод подходит для списка идентификаторов из запроса.

Сигнатура метода в классе `Bitrix\Main\Type\Collection`:

```php
public static function normalizeArrayValuesByInt(&$map, $sorted = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| map\* | `array` | Задает массив. Метод меняет его на месте |
| sorted | `bool` | Задает сортировку результата по возрастанию при `true`. По умолчанию — `true` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. После вызова `map` содержит список чисел с ключами от `0`. Если положительных чисел нет, `map` становится пустым массивом.

Если `map` пустой или не массив, метод его не меняет.

## Примеры

**Пример.** Код оставляет в списке идентификаторов уникальные положительные числа:

```php
<?php
use Bitrix\Main\Type\Collection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$ids = ['7', '3', 'abc', '-1', '7', 0, '12'];

Collection::normalizeArrayValuesByInt($ids);

echo implode(', ', $ids);
```

Код выведет `3, 7, 12`.

## Смотрите также

- [Collection::isAssociative](is-associative.md)
