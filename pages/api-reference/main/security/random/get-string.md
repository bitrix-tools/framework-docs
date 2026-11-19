---
title: Получить случайную строку Random::getString
description: Метод Random::getString возвращает случайную строку из цифр и строчных латинских букв, а при необходимости — и прописных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Random::getString` возвращает случайную строку из цифр и строчных латинских букв. Если `caseSensitive` равен `true`, в строку попадают и прописные буквы. Аналог в классическом API — `randString($length)`, он вызывает метод с `caseSensitive = true`.

Сигнатура метода в классе `Bitrix\Main\Security\Random`:

```php
public static function getString($length, $caseSensitive = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| length\* | `int` | Задает длину строки |
| caseSensitive | `bool` | Добавляет прописные латинские буквы, если равен `true`. По умолчанию — `false` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` длиной `length`. Метод вызывает [getStringByAlphabet](get-string-by-alphabet.md) с маской `ALPHABET_NUM | ALPHABET_ALPHALOWER`, а при `caseSensitive` — также `ALPHABET_ALPHAUPPER`.

## Примеры

**Пример.** Код генерирует токен из 32 символов с прописными буквами:

```php
<?php
use Bitrix\Main\Security\Random;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Random::getString(32, true);
```

## Смотрите также

- [Random::getStringByAlphabet](get-string-by-alphabet.md)
