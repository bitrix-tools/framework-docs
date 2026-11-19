---
title: Отправить асинхронный запрос HttpClient::sendAsyncRequest
description: Метод HttpClient::sendAsyncRequest ставит запрос PSR-7 в очередь и возвращает объект Promise с отложенным ответом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::sendAsyncRequest` ставит запрос в очередь асинхронных запросов и сразу возвращает объект Promise. Запросы уходят при вызове [wait](wait.md). Этот метод отправляет их параллельно и возвращает ответы. Метод нужен, чтобы опросить несколько медленных сервисов быстрее, чем последовательными запросами.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function sendAsyncRequest(RequestInterface $request): PromiseInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Psr\Http\Message\RequestInterface` | Задает запрос, например объект `Bitrix\Main\Web\Http\Request` |

## Возвращаемое значение

Метод возвращает объект `Http\Promise\Promise` — для сокетов `Bitrix\Main\Web\Http\Socket\Promise`, для cURL `Bitrix\Main\Web\Http\Curl\Promise`. Метод `getId` объекта возвращает идентификатор запроса, метод `wait` — ответ.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\Web\Http\RequestException` | Схема адреса не `http` и не `https`, в адресе нет хоста, хост не переводится в Punycode или адрес частный при запрете |

## Особенности

- Метод не переходит по редиректам.
- Все запросы одного клиента попадают в одну очередь. Метод [wait](wait.md) ждет ответы на все запросы очереди.
- Ошибки сети выбрасывает `wait`, а не этот метод.
- Методы клиента [getStatus](get-status.md) и [getHeaders](get-headers.md) не возвращают асинхронные ответы. Читайте ответ из результата `wait`.

## Примеры

**Пример.** Код отправляет два запроса параллельно:

```php
<?php
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$promises = [];

foreach (['kg', 'g'] as $unit)
{
    $promises[$unit] = $client->sendAsyncRequest(new Request('GET', new Uri('https://postman-echo.com/get?unit=' . $unit)));
}

$responses = $client->wait();

foreach ($promises as $unit => $promise)
{
    $response = $responses[$promise->getId()];
    echo $unit . '=' . Json::decode((string)$response->getBody())['args']['unit'] . ' ';
}
```

Код выведет `kg=kg g=g`.

## Смотрите также

- [HttpClient::wait](wait.md)
- [HTTP-клиент](../../../../advanced/http-client.md)
