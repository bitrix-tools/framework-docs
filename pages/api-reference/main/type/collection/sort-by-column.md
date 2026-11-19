---
title: Отсортировать массив по колонкам Collection::sortByColumn
description: Метод Collection::sortByColumn сортирует массив строк по одной или нескольким колонкам с флагами array_multisort.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Collection::sortByColumn` сортирует массив строк по значениям колонок. Строка — вложенный массив, колонка — ключ в нем. Метод меняет переданный массив и сортирует его функцией `array_multisort`.

Сигнатура метода в классе `Bitrix\Main\Type\Collection`:

```php
public static function sortByColumn(array &$array, $columns, $callbacks = '', $defaultValueIfNotSetValue = null, $preserveKeys = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

#|
|| Параметр | Тип | Описание ||
|| array\* | `array` | Задает массив строк. Метод сортирует его на месте ||
|| columns\* | `string`, `array` | Задает колонки:
- строка — имя одной колонки, сортировка по возрастанию,
- массив — имена колонок в ключах и флаги `array_multisort` в значениях, например `['SORT' => SORT_ASC, 'NAME' => [SORT_STRING, SORT_DESC]]` ||
|| callbacks | `callable`, `array` | Задает функцию, которая преобразует значение колонки перед сравнением. Массив задает функции для отдельных колонок, ключ — имя колонки. Массив, который сам вызываем, например `['Class', 'method']`, метод считает общей функцией. По умолчанию — пустая строка, без преобразования ||
|| defaultValueIfNotSetValue | `mixed` | Задает значение для строки, в которой нет колонки или колонка равна `null`. По умолчанию — `null` ||
|| preserveKeys | `bool` | Задает, сохранять ли ключи массива. При `false` метод нумерует числовые ключи заново. По умолчанию — `false` ||
|#

Типы `columns`, `callbacks` и `preserveKeys` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает и меняет массив `array`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentOutOfRangeException` | Значение `callbacks` или его элемент для колонки нельзя вызвать как функцию |

## Особенности

Строки с равными значениями колонок `array_multisort` упорядочивает, сравнивая сами строки. Исходный порядок таких строк не сохраняется.

## Примеры

**Пример.** Код сортирует единицы измерения по колонке `SORT` по возрастанию, а при равном `SORT` — по коду по убыванию:

```php
<?php
use Bitrix\Main\Type\Collection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$units = [
    ['CODE' => 'm', 'SORT' => 200],
    ['CODE' => 'kg', 'SORT' => 100],
    ['CODE' => 'l', 'SORT' => 100],
];

Collection::sortByColumn($units, ['SORT' => SORT_ASC, 'CODE' => SORT_DESC]);

echo implode(', ', array_column($units, 'CODE'));
```

Код выведет `l, kg, m`.

## Смотрите также

- [Collection::getByNestedKey](get-by-nested-key.md)
