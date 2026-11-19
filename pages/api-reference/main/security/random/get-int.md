---
title: Получить случайное число Random::getInt
description: Метод Random::getInt возвращает случайное целое число в заданном диапазоне из криптографического источника.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Random::getInt` возвращает случайное целое число от `min` до `max` включительно. Метод получает случайные байты через [getBytes](get-bytes.md) и отбрасывает значения вне диапазона, пока не получит подходящее.

Сигнатура метода в классе `Bitrix\Main\Security\Random`:

```php
public static function getInt($min = 0, $max = \PHP_INT_MAX)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| min | `int` | Задает нижнюю границу. По умолчанию — `0` |
| max | `int` | Задает верхнюю границу. По умолчанию — `PHP_INT_MAX` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает целое число `int`. Если `min` и `max` равны, метод возвращает `max`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | `min` больше `max` |
| `Bitrix\Main\SystemException` | Разность `max − min` больше `PHP_INT_MAX`, например при большом отрицательном `min` |

## Примеры

**Пример.** Код генерирует шестизначный код подтверждения:

```php
<?php
use Bitrix\Main\Security\Random;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Random::getInt(100000, 999999);
```

## Смотрите также

- [Random::getString](get-string.md)
- [Random::getBytes](get-bytes.md)
