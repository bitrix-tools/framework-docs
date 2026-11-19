---
title: Создать коллекцию из текста заголовков ответа HttpHeaders::createFromString
description: Метод HttpHeaders::createFromString создает коллекцию из текста заголовков HTTP-ответа вместе со строкой статуса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::createFromString` создает коллекцию из текста заголовков HTTP-ответа. Метод читает статус и версию из первой строки, а заголовки — из остальных строк.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public static function createFromString(string $response): HttpHeaders
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| response\* | `string` | Задает текст заголовков. Строки разделены `\r\n` или `\n` |

## Возвращаемое значение

Метод возвращает новый объект `HttpHeaders`.

## Особенности

При разборе текста метод:

- всегда разбирает первую строку как строку статуса через [parseStatus](parse-status.md),
- добавляет строку, которая начинается с пробела или табуляции, как отдельное значение предыдущего заголовка,
- без ошибки пропускает строки без двоеточия и заголовки с недопустимым именем или значением,
- не останавливается на пустой строке перед телом ответа.

Передавайте только блок заголовков и начинайте текст со строки статуса. Если текст начинается сразу с заголовка, этот заголовок потеряется. Строки тела с двоеточием станут заголовками.

## Примеры

**Пример.** Код разбирает текст ответа:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = "HTTP/1.1 404 Not Found\r\n"
    . "Content-Type: text/html\r\n"
    . "Broken line\r\n"
    . "X-Units: kg\r\n";

$headers = HttpHeaders::createFromString($response);

echo $headers->getStatus() . ' ' . $headers->getReasonPhrase() . "\n";
echo $headers->toString();
```

Код выведет:

```text
404 Not Found
Content-Type: text/html
X-Units: kg
```

## Смотрите также

- [HttpHeaders::parseStatus](parse-status.md)
- [HttpHeaders::toString](to-string.md)
