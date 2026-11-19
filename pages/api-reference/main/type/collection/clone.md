---
title: Скопировать массив с объектами Collection::clone
description: Метод Collection::clone копирует массив рекурсивно и клонирует объекты внутри него.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Collection::clone` копирует массив вместе с вложенными массивами и клонирует каждый объект оператором `clone`. При обычном присваивании массива объекты внутри остаются общими, а копия от `Collection::clone` не делит с исходным массивом объекты верхнего уровня.

Сигнатура метода в классе `Bitrix\Main\Type\Collection`:

```php
public static function clone(array $originalArray): array
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| originalArray\* | `array` | Задает исходный массив |

## Возвращаемое значение

Метод возвращает новый массив с теми же ключами.

Вложенные в объект объекты метод отдельно не копирует. Они копируются, только если это делает метод `__clone` класса, например у `Bitrix\Main\Type\Date`.

## Примеры

**Пример.** Код копирует массив с датой и меняет дату в копии. Дата в исходном массиве не меняется:

```php
<?php
use Bitrix\Main\Type\Collection;
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$original = ['unit' => 'kg', 'checked' => new Date('2026-01-01', 'Y-m-d')];

$copy = Collection::clone($original);
$copy['checked']->add('1 day');

echo $original['checked']->format('Y-m-d') . ' ' . $copy['checked']->format('Y-m-d');
```

Код выведет `2026-01-01 2026-01-02`.

## Смотрите также

- [Collection::setByNestedKey](set-by-nested-key.md)
