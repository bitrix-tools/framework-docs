---
title: Получить заголовки ответа HttpClient::getHeaders
description: Метод HttpClient::getHeaders возвращает заголовки последнего ответа объектом HttpHeaders.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getHeaders` возвращает заголовки последнего полученного ответа. Метод [getRequestHeaders](get-request-headers.md) возвращает заголовки запроса.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getHeaders(): HttpHeaders
```

## Возвращаемое значение

Метод возвращает объект [HttpHeaders](../http-headers/index.md). Если клиент еще не получил ни одного ответа, метод возвращает пустой объект. Если последний запрос не удался, метод возвращает заголовки предыдущего ответа.

## Примеры

**Пример.** Код читает заголовок ответа:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->get('https://postman-echo.com/response-headers?X-Units-Version=2');

echo $client->getHeaders()->get('X-Units-Version');
```

Код выведет `2`.

## Смотрите также

- [HttpHeaders](../http-headers/index.md)
- [HttpClient::getContentType](get-content-type.md)
