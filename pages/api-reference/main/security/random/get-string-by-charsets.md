---
title: Получить строку из заданных символов Random::getStringByCharsets
description: Метод Random::getStringByCharsets возвращает случайную строку из символов переданной строки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Random::getStringByCharsets` возвращает случайную строку из символов переданного набора. Аналог в классическом API — `randString($length, $chars)` со строкой символов, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\Security\Random`:

```php
public static function getStringByCharsets($length, $charsetList)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| length\* | `int` | Задает длину строки |
| charsetList\* | `string` | Задает символы, из которых метод составляет строку. Метод работает с байтами, поэтому передавайте только символы ASCII. Пустая строка вызывает ошибку PHP `DivisionByZeroError` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` длиной `length`. Каждый символ метод выбирает по случайному байту из [getBytes](get-bytes.md).

## Примеры

**Пример.** Код генерирует код из шести символов без похожих друг на друга `0`, `O`, `1` и `I`:

```php
<?php
use Bitrix\Main\Security\Random;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Random::getStringByCharsets(6, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
```

## Смотрите также

- [Random::getStringByArray](get-string-by-array.md)
- [Random::getStringByAlphabet](get-string-by-alphabet.md)
