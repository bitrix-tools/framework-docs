---
title: Проверить кодировку UTF-8 Encoding::detectUtf8
description: Метод Encoding::detectUtf8 проверяет, что строка — корректная последовательность UTF-8.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Encoding::detectUtf8` проверяет, что строка — корректная последовательность UTF-8. Строка только из символов ASCII тоже проходит проверку.

Сигнатура метода в классе `Bitrix\Main\Text\Encoding`:

```php
public static function detectUtf8($string, $replaceHex = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| string\* | `string` | Задает строку |
| replaceHex | `bool` | Перед проверкой заменяет последовательности `%XX` байтами, если равен `true`. Так метод проверяет строки из URL. По умолчанию — `true` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если строка — корректная строка UTF-8, иначе `false`.

## Примеры

**Пример.** Код проверяет строку в UTF-8 и строку из URL в кодировке Windows-1251:

```php
<?php
use Bitrix\Main\Text\Encoding;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Encoding::detectUtf8('Метр'), Encoding::detectUtf8('%CC%E5%F2%F0'));
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [Encoding::convertToUtf](convert-to-utf.md)
