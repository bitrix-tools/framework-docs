---
title: Записать значение по вложенному ключу Collection::setByNestedKey
description: Метод Collection::setByNestedKey записывает значение в многомерный массив по пути из ключей и создает недостающие уровни.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Collection::setByNestedKey` записывает значение в многомерный массив по пути из ключей. Если уровня нет, метод создает пустой массив.

Сигнатура метода в классе `Bitrix\Main\Type\Collection`:

```php
public static function setByNestedKey(array &$array, array $key, $value): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| array\* | `array` | Задает массив. Метод меняет его на месте |
| key\* | `array` | Задает путь из ключей от внешнего уровня к внутреннему |
| value\* | `mixed` | Задает значение |

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Путь `key` пустой |
| `TypeError` | Промежуточный уровень пути существует и не массив, например строка или `null`. Исключение выбрасывает PHP в функции `array_key_exists` |

## Примеры

**Пример.** Код записывает единицу объема в настройки, где еще нет уровня `volume`:

```php
<?php
use Bitrix\Main\Type\Collection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$settings = [
    'units' => [
        'weight' => ['default' => 'kg'],
    ],
];

Collection::setByNestedKey($settings, ['units', 'volume', 'default'], 'l');

echo $settings['units']['volume']['default'];
```

Код выведет `l`.

## Смотрите также

- [Collection::getByNestedKey](get-by-nested-key.md)
- [Collection::unsetByNestedKey](unset-by-nested-key.md)
