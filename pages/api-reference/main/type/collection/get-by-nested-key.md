---
title: Получить значение по вложенному ключу Collection::getByNestedKey
description: Метод Collection::getByNestedKey возвращает значение многомерного массива по пути из ключей или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Collection::getByNestedKey` возвращает значение многомерного массива по пути из ключей. Путь `['a', 'b', 'c']` соответствует `$array['a']['b']['c']`.

Сигнатура метода в классе `Bitrix\Main\Type\Collection`:

```php
public static function getByNestedKey(array $array, array $key)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| array\* | `array` | Задает массив |
| key\* | `array` | Задает путь из ключей от внешнего уровня к внутреннему |

## Возвращаемое значение

Метод возвращает найденное значение или `null`, если путь пустой, одного из ключей нет или значение по пути равно `null`.

## Особенности

Если промежуточный уровень пути не массив, например строка, `null` или объект, PHP выбрасывает `TypeError` в функции `array_key_exists`.

## Примеры

**Пример.** Код читает настройку из вложенного массива и запрашивает ключ, которого нет:

```php
<?php
use Bitrix\Main\Type\Collection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$settings = [
    'units' => [
        'weight' => ['default' => 'kg'],
    ],
];

var_dump(Collection::getByNestedKey($settings, ['units', 'weight', 'default']));
var_dump(Collection::getByNestedKey($settings, ['units', 'volume', 'default']));
```

Код выведет `string(2) "kg"` и `NULL`.

## Смотрите также

- [Collection::setByNestedKey](set-by-nested-key.md)
- [Collection::unsetByNestedKey](unset-by-nested-key.md)
