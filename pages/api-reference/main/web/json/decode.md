---
title: Разобрать JSON Json::decode
description: Метод Json::decode разбирает строку JSON в значение PHP, объекты превращает в ассоциативные массивы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Json::decode` разбирает строку JSON в значение PHP функцией `json_decode`. Объекты JSON метод превращает в ассоциативные массивы. При ошибке метод выбрасывает исключение.

Сигнатура метода в классе `Bitrix\Main\Web\Json`:

```php
public static function decode($data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `string` | Задает строку JSON. Наибольшая глубина вложенности — 512 |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает значение PHP — массив, строку, число, `bool` или `null`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Строку не удалось разобрать, в том числе если она пустая. Сообщение начинается с `JSON error:` |

## Примеры

**Пример.** Код разбирает строку JSON и обрабатывает ошибку:

```php
<?php
use Bitrix\Main\ArgumentException;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    $data = Json::decode('{"code":"kg","sort":10}');
    echo $data['code'];
}
catch (ArgumentException $exception)
{
    echo $exception->getMessage();
}
```

## Смотрите также

- [Json::encode](encode.md)
- [Json::validate](validate.md)
