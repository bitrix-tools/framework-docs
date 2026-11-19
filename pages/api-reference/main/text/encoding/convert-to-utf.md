---
title: Перевести строку в UTF-8 Encoding::convertToUtf
description: Метод Encoding::convertToUtf переводит строку в UTF-8 из кодировки по умолчанию, если строка еще не в UTF-8.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Encoding::convertToUtf` переводит строку в UTF-8, если она еще не в UTF-8. Исходную кодировку метод не определяет, а берет из настроек.

Сигнатура метода в классе `Bitrix\Main\Text\Encoding`:

```php
public static function convertToUtf($string)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| string\* | `string` | Задает строку |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string`.

Если [detectUtf8](detect-utf8.md) признает строку корректной строкой UTF-8, метод возвращает ее без изменений. Иначе метод перекодирует строку из кодировки по умолчанию. Метод берет ее по порядку из секции `default_charset` настроек ядра в `.settings.php` или `.settings_extra.php`, из константы `BX_DEFAULT_CHARSET` или использует `Windows-1251`.

Если кодировка по умолчанию — `UTF-8` или неизвестна `mbstring`, метод возвращает исходную строку без изменений.

## Примеры

**Пример.** Код переводит в UTF-8 строку в Windows-1251 и не меняет строку, которая уже в UTF-8:

```php
<?php
use Bitrix\Main\Text\Encoding;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$legacy = mb_convert_encoding('Килограмм', 'Windows-1251', 'UTF-8');

echo Encoding::convertToUtf($legacy) . ' ' . Encoding::convertToUtf('Метр');
```

## Смотрите также

- [Encoding::convertEncoding](convert-encoding.md)
- [Encoding::detectUtf8](detect-utf8.md)
