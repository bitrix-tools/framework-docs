---
title: Отправить HEAD-запрос HttpClient::head
description: Метод HttpClient::head отправляет HEAD-запрос и возвращает заголовки ответа без тела.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::head` отправляет HEAD-запрос и возвращает заголовки ответа. Метод нужен, чтобы проверить файл или страницу без загрузки тела, например узнать тип или размер файла.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function head($url)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает абсолютный адрес |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект [HttpHeaders](../http-headers/index.md) с заголовками ответа или `false`, если запрос не удался.

## Особенности

Метод переходит по редиректам, как [get](get.md).

## Примеры

**Пример.** Код узнает тип страницы без загрузки тела:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$headers = $client->head('https://example.org/');

echo ($headers !== false ? $headers->getContentType() : 'request failed');
```

Код выведет `text/html`.

## Смотрите также

- [HttpClient::getHeaders](get-headers.md)
- [HttpHeaders](../http-headers/index.md)
