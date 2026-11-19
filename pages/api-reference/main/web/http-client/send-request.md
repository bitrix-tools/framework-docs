---
title: Отправить запрос PSR-18 HttpClient::sendRequest
description: Метод HttpClient::sendRequest отправляет запрос PSR-7 и возвращает ответ PSR-7 по стандарту PSR-18.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::sendRequest` отправляет запрос по стандарту PSR-18. Метод принимает объект запроса PSR-7 и возвращает объект ответа. Метод нужен для библиотек, которые работают с интерфейсом `Psr\Http\Client\ClientInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function sendRequest(RequestInterface $request): ResponseInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Psr\Http\Message\RequestInterface` | Задает запрос, например объект `Bitrix\Main\Web\Http\Request` |

## Возвращаемое значение

Метод возвращает ответ `Bitrix\Main\Web\Http\Response`. Для ответа с кодом ошибки HTTP, например 404, метод не выбрасывает исключение.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\Web\Http\RequestException` | Схема адреса не `http` и не `https`, в адресе нет хоста, хост не переводится в Punycode или адрес частный при запрете из [setPrivateIp](set-private-ip.md) |
| `Bitrix\Main\Web\Http\NetworkException` | Ошибка сети, например хост не найден или превышено время ожидания |

Оба исключения реализуют `Psr\Http\Client\ClientExceptionInterface`.

## Особенности

- Метод не переходит по редиректам. Заголовок `Location` обработайте сами.
- Заголовки из [setHeader](set-header.md) и cookie из [setCookies](set-cookies.md) в запрос не попадают. Передайте их в объекте запроса.
- Клиент добавляет стандартные заголовки, например `Host`, `Connection` и `Accept`, и применяет свои настройки — время ожидания, прокси, запрет частных адресов, проверку SSL, ограничение размера и чтение тела.
- Клиент не очищает ошибки прошлых запросов. Текст исключения `RequestException` может взяться из старой ошибки — для каждого запроса создавайте новый клиент или опирайтесь на класс исключения.
- Клиент сохраняет ответ, поэтому после вызова работают [getStatus](get-status.md) и [getHeaders](get-headers.md).

## Примеры

**Пример.** Код отправляет запрос PSR-7 и обрабатывает исключение:

```php
<?php
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;
use Bitrix\Main\Web\Uri;
use Psr\Http\Client\ClientExceptionInterface;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$request = new Request('GET', new Uri('https://postman-echo.com/get?unit=kg'), ['Accept' => 'application/json']);

try
{
    $response = $client->sendRequest($request);
    echo $response->getStatusCode() . ' ' . Json::decode((string)$response->getBody())['args']['unit'];
}
catch (ClientExceptionInterface $e)
{
    echo 'request failed: ' . $e->getMessage();
}
```

Код выведет `200 kg`.

## Смотрите также

- [HttpClient::sendAsyncRequest](send-async-request.md)
- [HTTP-клиент](../../../../advanced/http-client.md)
