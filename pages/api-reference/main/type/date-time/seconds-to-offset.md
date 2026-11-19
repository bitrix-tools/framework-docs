---
title: Перевести смещение в строку DateTime::secondsToOffset
description: Метод DateTime::secondsToOffset переводит смещение от UTC в секундах в строку вида +0300 или +03:00.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DateTime::secondsToOffset` переводит смещение от UTC в секундах в строку со знаком, часами и минутами. Конструктор стандартного класса `\DateTimeZone` принимает такую строку.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public static function secondsToOffset($seconds, $delimiter = '')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| seconds\* | `int` | Задает смещение в секундах. Отрицательное значение — пояс западнее UTC |
| delimiter | `string` | Задает разделитель между часами и минутами, например `':'`. По умолчанию — пустая строка |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку вида `+HHMM` или `-HHMM`, с разделителем — `+HH:MM`. Для нулевого смещения метод возвращает `+0000`. Метод отбрасывает секунды.

## Примеры

**Пример.** Код переводит три смещения в строки:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo DateTime::secondsToOffset(10800) . ' ' . DateTime::secondsToOffset(-19800) . ' ' . DateTime::secondsToOffset(10800, ':');
```

Код выведет `+0300 -0530 +03:00`.

## Смотрите также

- [DateTime::getOffset](get-offset.md)
