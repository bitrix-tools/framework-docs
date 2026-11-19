---
title: Получить код статуса ответа HttpClient::getStatus
description: Метод HttpClient::getStatus возвращает код статуса HTTP последнего ответа или 0, если ответа нет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getStatus` возвращает код статуса HTTP последнего ответа, например `200` или `404`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getStatus()
```

## Возвращаемое значение

Метод возвращает целое число. Если клиент еще не получил ни одного ответа, метод возвращает `0`.

## Особенности

- Метод [get](get.md) возвращает тело, а [query](query.md) возвращает `true`, даже если ответ пришел с кодом ошибки. Проверяйте код, чтобы отличить успешный ответ от ошибки сервера.
- Если запрос не удался, метод возвращает код предыдущего ответа этого клиента. Сначала проверяйте результат запроса.

## Примеры

**Пример.** Код обрабатывает ответ 404:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$body = $client->get('https://postman-echo.com/status/404');

echo var_export($body !== false, true) . ' ' . $client->getStatus();
```

Код выведет `true 404`.

## Смотрите также

- [HttpClient::getResponse](get-response.md)
