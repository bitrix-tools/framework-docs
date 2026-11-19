---
title: Отправить GET-запрос HttpClient::get
description: Метод HttpClient::get отправляет GET-запрос и возвращает тело ответа строкой или false при ошибке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::get` отправляет GET-запрос и возвращает тело ответа. Метод переходит по редиректам, если их не выключил метод [setRedirect](set-redirect.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function get($url)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает абсолютный адрес со схемой `http` или `https`, например `https://example.com/api/?id=1` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тело ответа строкой. Если запрос не удался, например сервер недоступен или адрес неверный, метод возвращает `false`. Метод [getError](get-error.md) возвращает описание ошибки.

## Особенности

- Метод возвращает тело и для ответа с кодом ошибки, например 404 или 500. Проверяйте код методом [getStatus](get-status.md).
- Если задан поток [setOutputStream](set-output-stream.md), метод записывает тело ответа в поток и возвращает пустую строку.

## Примеры

**Пример.** Код запрашивает JSON у внешнего сервиса и проверяет статус:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient(['socketTimeout' => 10, 'streamTimeout' => 10]);
$body = $client->get('https://postman-echo.com/get?unit=kg');

if ($body !== false && $client->getStatus() === 200)
{
    $data = Json::decode($body);
    echo $data['args']['unit'];
}
else
{
    echo 'request failed';
}
```

Код выведет `kg`.

## Смотрите также

- [HttpClient::post](post.md)
- [HttpClient::query](query.md)
- [HttpClient::getError](get-error.md)
