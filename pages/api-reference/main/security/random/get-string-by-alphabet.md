---
title: Получить строку по маске наборов Random::getStringByAlphabet
description: Метод Random::getStringByAlphabet возвращает случайную строку из наборов символов, заданных маской констант ALPHABET_*.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Random::getStringByAlphabet` возвращает случайную строку из наборов символов, которые задает маска констант `ALPHABET_*`. Флаг `requireAll` требует, чтобы в строке были символы из каждого набора.

Сигнатура метода в классе `Bitrix\Main\Security\Random`:

```php
public static function getStringByAlphabet($length, $alphabet, $requireAll = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| length\* | `int` | Задает длину строки |
| alphabet\* | `int` | Задает маску наборов символов, например `Random::ALPHABET_NUM \| Random::ALPHABET_SPECIAL`. Константы перечислены на странице [класса](index.md#константы). Маска `0` вызывает ошибку PHP `DivisionByZeroError` |
| requireAll | `bool` | Требует символ из каждого набора, если равен `true` и наборов больше одного. По умолчанию — `false` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` длиной `length`.

Без `requireAll` метод склеивает наборы и вызывает [getStringByCharsets](get-string-by-charsets.md), поэтому какой-то набор может не попасть в строку. С `requireAll` метод вызывает [getStringByArray](get-string-by-array.md).

## Примеры

**Пример.** Код генерирует пароль из 12 символов, в котором есть цифры, буквы обоих регистров и специальные символы:

```php
<?php
use Bitrix\Main\Security\Random;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Random::getStringByAlphabet(12, Random::ALPHABET_ALL, true);
```

## Смотрите также

- [Random::getStringByArray](get-string-by-array.md)
- [Random::getString](get-string.md)
