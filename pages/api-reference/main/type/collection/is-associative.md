---
title: Проверить, ассоциативный ли массив Collection::isAssociative
description: Метод Collection::isAssociative проверяет, отличаются ли ключи массива от последовательности 0, 1, 2 и так далее.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.4

{% endnote %}

Метод `Collection::isAssociative` проверяет, ассоциативный ли массив. Метод считает массив списком, если его ключи — числа `0`, `1`, `2` и так далее подряд. Любой другой набор ключей метод считает ассоциативным.

Сигнатура метода в классе `Bitrix\Main\Type\Collection`:

```php
public static function isAssociative(array $array)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| array\* | `array` | Задает массив для проверки |

## Возвращаемое значение

Метод возвращает `true` для ассоциативного массива и `false` для списка. Пустой массив метод считает списком. Список с пропуском ключа, например после `unset`, метод считает ассоциативным.

## Примеры

**Пример.** Код проверяет список, массив со строковыми ключами и список после удаления элемента:

```php
<?php
use Bitrix\Main\Type\Collection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$units = ['kg', 'm', 'l'];

var_dump(Collection::isAssociative($units));
var_dump(Collection::isAssociative(['weight' => 'kg']));

unset($units[1]);
var_dump(Collection::isAssociative($units));
```

Код выведет `bool(false)`, `bool(true)` и `bool(true)`.

## Смотрите также

- [Collection::normalizeArrayValuesByInt](normalize-array-values-by-int.md)
