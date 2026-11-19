---
title: Перекодировать данные Encoding::convertEncoding
description: Метод Encoding::convertEncoding переводит строку или массив из одной кодировки в другую через mbstring.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Encoding::convertEncoding` переводит строку или массив из одной кодировки в другую функцией `mb_convert_encoding`. В массиве метод перекодирует и ключи, и значения на всех уровнях вложенности.

Сигнатура метода в классе `Bitrix\Main\Text\Encoding`:

```php
public static function convertEncoding($data, $charsetFrom, $charsetTo)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `string`, `array`, `SplFixedArray` | Задает данные. Значения других типов метод возвращает без изменений |
| charsetFrom\* | `string` | Задает исходную кодировку, например `Windows-1251`. Регистр не важен |
| charsetTo\* | `string` | Задает целевую кодировку, например `UTF-8` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает перекодированные данные того же вида — строку, массив или `SplFixedArray`.

Метод возвращает данные без изменений и без ошибки, если одна из кодировок пустая или неизвестна `mbstring`, а также если кодировки совпадают.

Метод обрезает пробелы в названиях кодировок, приводит их к нижнему регистру и заменяет некоторые названия. Например, `ks_c_5601-1987` и похожие названия он заменяет на `euc-kr`, а `windows-1257` — на `ISO-8859-13`.

Если исходная кодировка — ровно `UTF-16`, метод определяет порядок байтов по метке в начале строки и отрезает метку. Без метки метод читает строку как `UTF-16LE`.

## Примеры

**Пример.** Код переводит строку CSV из Windows-1251 в UTF-8:

```php
<?php
use Bitrix\Main\Text\Encoding;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$line = mb_convert_encoding('Килограмм;kg', 'Windows-1251', 'UTF-8');

$fields = explode(';', Encoding::convertEncoding($line, 'Windows-1251', 'UTF-8'));
echo $fields[0];
```

## Смотрите также

- [Encoding::convertToUtf](convert-to-utf.md)
- [Encoding::detectUtf8](detect-utf8.md)
