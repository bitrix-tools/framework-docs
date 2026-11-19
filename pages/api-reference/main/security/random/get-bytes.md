---
title: Получить случайные байты Random::getBytes
description: Метод Random::getBytes возвращает строку случайных байтов заданной длины.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Random::getBytes` возвращает строку случайных байтов. Остальные методы класса получают случайность через него.

Сигнатура метода в классе `Bitrix\Main\Security\Random`:

```php
public static function getBytes($length)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| length\* | `int` | Задает число байтов. Значение `0` и меньше метод заменяет на `1` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает двоичную строку `string` длиной `length` байтов. Метод берет байты из первого доступного источника.

1. Функция `openssl_random_pseudo_bytes`, если она сообщает о криптостойком результате.
2. Файл `/dev/urandom`.
3. Результат `openssl_random_pseudo_bytes` без признака криптостойкости.
4. Блоки по 64 байта от `openssl_random_pseudo_bytes`, а если функция не вернула данные — хеш SHA-512 от значений `mt_rand`. Последний вариант не криптографический.

## Примеры

**Пример.** Код генерирует 16 случайных байтов и выводит их в шестнадцатеричном виде:

```php
<?php
use Bitrix\Main\Security\Random;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo bin2hex(Random::getBytes(16));
```

## Смотрите также

- [Random::getInt](get-int.md)
- [Random::getStringByCharsets](get-string-by-charsets.md)
