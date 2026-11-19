---
title: Перевести строку в текущую кодировку Encoding::convertEncodingToCurrent
description: Метод Encoding::convertEncodingToCurrent переводит строку в UTF-8 и вызывает convertToUtf.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Encoding::convertEncodingToCurrent` переводит строку в UTF-8. Метод вызывает [convertToUtf](convert-to-utf.md) и работает так же.

Сигнатура метода в классе `Bitrix\Main\Text\Encoding`:

```php
public static function convertEncodingToCurrent($string)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| string\* | `string` | Задает строку |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` в UTF-8. Правила те же, что у [convertToUtf](convert-to-utf.md).

## Примеры

**Пример.** Код переводит строку из Windows-1251 в UTF-8:

```php
<?php
use Bitrix\Main\Text\Encoding;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Encoding::convertEncodingToCurrent(mb_convert_encoding('Литр', 'Windows-1251', 'UTF-8'));
```

## Смотрите также

- [Encoding::convertToUtf](convert-to-utf.md)
