---
title: Решить, читать ли тело ответа HttpClient::shouldFetchBody
description: Метод HttpClient::shouldFetchBody задает функцию, которая после получения заголовков решает, читать ли тело ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 23.300.0

{% endnote %}

Метод `HttpClient::shouldFetchBody` задает функцию, которая решает, читать ли тело ответа. Клиент вызывает функцию после получения заголовков. Метод нужен, например, чтобы не скачивать слишком большой файл или файл неподходящего типа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function shouldFetchBody(callable $callback)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| callback\* | `callable` | Задает функцию. Функция получает ответ `Bitrix\Main\Web\Http\Response` с заголовками и запрос `Bitrix\Main\Web\Http\Request`. Если функция возвращает `false`, клиент не читает тело |

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

Функция заменяет настройку [waitResponse](wait-response.md) для всех следующих запросов клиента.

## Примеры

**Пример.** Код читает тело, только если ответ в формате JSON:

```php
<?php
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\Http\Response;
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->shouldFetchBody(
    function (Response $response, Request $request): bool
    {
        return str_starts_with($response->getHeadersCollection()->getContentType() ?? '', 'application/json');
    }
);

$html = $client->get('https://example.org/');
$json = $client->get('https://postman-echo.com/get');

echo strlen($html) . ' ' . (strlen($json) > 0 ? 'json body' : 'empty');
```

Код выведет `0 json body`.

## Смотрите также

- [HttpClient::waitResponse](wait-response.md)
- [HttpClient::setBodyLengthMax](set-body-length-max.md)
