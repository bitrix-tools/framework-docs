---
title: Получить объект ответа HttpClient::getResponse
description: Метод HttpClient::getResponse возвращает последний ответ объектом PSR-7 Bitrix\Main\Web\Http\Response.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getResponse` возвращает последний ответ объектом PSR-7 `Bitrix\Main\Web\Http\Response`. Объект нужен, когда код работает с интерфейсом `Psr\Http\Message\ResponseInterface`, например передает ответ в библиотеку.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getResponse()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Web\Http\Response` или `null`, если ответа нет.

## Примеры

**Пример.** Код читает статус и версию протокола ответа:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->get('https://example.org/');
$response = $client->getResponse();

echo $response->getStatusCode() . ' ' . $response->getReasonPhrase();
```

Код выведет `200 OK`.

## Смотрите также

- [HttpClient::sendRequest](send-request.md)
