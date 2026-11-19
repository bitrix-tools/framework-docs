---
title: Включить или выключить чтение тела ответа HttpClient::waitResponse
description: Метод HttpClient::waitResponse задает, читать ли тело ответа или закрывать соединение сразу после заголовков.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::waitResponse` задает, читать ли тело ответа. Если чтение выключено, клиент закрывает соединение сразу после заголовков. Режим нужен для запросов, ответ на которые не важен, например для уведомлений.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function waitResponse($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `bool` | Значение `true` включает чтение тела, `false` выключает |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Со значением `false` метод задает время ожидания чтения в 1 секунду. Клиент все равно ждет заголовки ответа. Если сервер не ответит за это время, запрос вернет `false` с ошибкой `NETWORK`.
- Если затем снова включить чтение, время ожидания в 1 секунду останется. Задайте нужное время методом [setStreamTimeout](set-stream-timeout.md).
- Без чтения тела клиент не переходит по редиректам.
- Чтобы решать по заголовкам, читать ли тело, используйте [shouldFetchBody](should-fetch-body.md).

## Примеры

**Пример.** Код отправляет запрос без чтения тела:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->waitResponse(false);
$result = $client->get('https://example.org/');

var_export([$result, $client->getStatus()]);
```

Код выведет:

```text
array (
  0 => '',
  1 => 200,
)
```

## Смотрите также

- [HttpClient::shouldFetchBody](should-fetch-body.md)
