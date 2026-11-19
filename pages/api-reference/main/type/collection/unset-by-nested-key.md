---
title: Удалить элемент по вложенному ключу Collection::unsetByNestedKey
description: Метод Collection::unsetByNestedKey удаляет элемент многомерного массива по пути из ключей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Collection::unsetByNestedKey` удаляет последний элемент пути из многомерного массива. Внешние уровни остаются, даже если после удаления они пустые.

Сигнатура метода в классе `Bitrix\Main\Type\Collection`:

```php
public static function unsetByNestedKey(array &$array, array $key): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| array\* | `array` | Задает массив. Метод меняет его на месте |
| key\* | `array` | Задает путь из ключей от внешнего уровня к внутреннему |

## Возвращаемое значение

Метод ничего не возвращает. Если одного из ключей пути нет, метод не меняет массив.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Путь `key` пустой |
| `TypeError` | Промежуточный уровень пути существует и не массив, например строка или `null`. Исключение выбрасывает PHP в функции `array_key_exists` |

## Примеры

**Пример.** Код удаляет единицу по умолчанию для веса и проверяет, что уровень `weight` остался:

```php
<?php
use Bitrix\Main\Type\Collection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$settings = [
    'units' => [
        'weight' => ['default' => 'kg'],
    ],
];

Collection::unsetByNestedKey($settings, ['units', 'weight', 'default']);

var_dump($settings['units']['weight']);
```

Код выведет пустой массив.

## Смотрите также

- [Collection::getByNestedKey](get-by-nested-key.md)
- [Collection::setByNestedKey](set-by-nested-key.md)
