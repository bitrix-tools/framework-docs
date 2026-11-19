---
title: Дождаться асинхронных ответов HttpClient::wait
description: Метод HttpClient::wait ждет ответы на запросы из очереди sendAsyncRequest и возвращает их массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::wait` ждет ответы на все запросы, которые поставил в очередь [sendAsyncRequest](send-async-request.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function wait(): array
```

## Возвращаемое значение

Метод возвращает массив ответов `Psr\Http\Message\ResponseInterface`. Ключ — идентификатор запроса, его возвращает метод `getId` объекта Promise. Порядок ответов может не совпадать с порядком запросов. Если очередь пуста, метод возвращает пустой массив.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\Web\Http\NetworkException` | Один из запросов завершился ошибкой сети. Метод выбрасывает исключение на первом таком запросе, и ответы остальных запросов в результат не попадают |

## Особенности

Чтобы получить ответы по отдельности, вызывайте метод `wait` у каждого объекта Promise из [sendAsyncRequest](send-async-request.md) в блоке `try/catch`.

## Примеры

**Пример.** Код ждет ответы и выводит коды статуса:

```php
<?php
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->sendAsyncRequest(new Request('GET', new Uri('https://postman-echo.com/status/200')));
$client->sendAsyncRequest(new Request('GET', new Uri('https://postman-echo.com/status/404')));

$codes = array_map(fn($response) => $response->getStatusCode(), $client->wait());
sort($codes);

echo implode(',', $codes);
```

Код выведет `200,404`.

## Смотрите также

- [HttpClient::sendAsyncRequest](send-async-request.md)
