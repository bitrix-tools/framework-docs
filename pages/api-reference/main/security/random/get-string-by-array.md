---
title: Получить строку с символами из каждого набора Random::getStringByArray
description: Метод Random::getStringByArray возвращает случайную строку, в которой есть символы из каждого переданного набора.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Random::getStringByArray` возвращает случайную строку, в которой есть символы из каждого набора, например цифры, буквы и специальные символы. Аналог в классическом API — `randString($length, $chars)` с массивом наборов, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\Security\Random`:

```php
public static function getStringByArray(int $length, array $charsetList): string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| length\* | `int` | Задает длину строки |
| charsetList\* | `string[]` | Задает наборы символов, каждый строкой. Передавайте только символы ASCII. С пустым массивом метод зацикливается и не возвращает результат. Пустая строка в массиве вызывает ошибку PHP `DivisionByZeroError` |

## Возвращаемое значение

Метод возвращает строку `string` длиной `length`.

Метод делит строку на группы по числу наборов. В каждой группе по одному символу из каждого набора в случайном порядке. Если `length` меньше числа наборов, в строку попадут не все наборы.

## Примеры

**Пример.** Код генерирует пароль из восьми символов, в котором есть цифры, строчные и прописные буквы:

```php
<?php
use Bitrix\Main\Security\Random;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Random::getStringByArray(8, ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);
```

## Смотрите также

- [Random::getStringByAlphabet](get-string-by-alphabet.md)
- [Random::getStringByCharsets](get-string-by-charsets.md)
