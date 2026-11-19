---
title: Отправить запрос любым методом HttpClient::query
description: Метод HttpClient::query отправляет запрос методом PUT, PATCH, DELETE или другим и возвращает true или false.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::query` отправляет запрос указанным методом HTTP. Методы [get](get.md), [post](post.md) и [head](head.md) вызывают его. Метод нужен для запросов PUT, PATCH, DELETE и других.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function query($method, $url, $entityBody = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| method\* | `string` | Задает метод HTTP заглавными буквами, например `HttpClient::HTTP_PUT` или `'DELETE'` |
| url\* | `string` | Задает абсолютный адрес |
| entityBody | `array`, `string`, `resource`, `Bitrix\Main\Web\Http\Stream` или `null` | Задает тело запроса. Метод кодирует массив как данные формы. По умолчанию — `null`, пустое тело |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если клиент получил ответ, даже с кодом ошибки. Если запрос не удался, метод возвращает `false`. Метод [getResult](get-result.md) возвращает тело ответа.

## Особенности

- Заголовок `Content-Type` метод добавляет сам только для POST. Для PUT и PATCH с данными формы задайте заголовок через [setHeader](set-header.md), иначе сервер может не разобрать тело.
- Перед каждым запросом клиент сбрасывает ошибки и адрес [getEffectiveUrl](get-effective-url.md), но не последний ответ. Если запрос не удался, [getStatus](get-status.md) и [getResult](get-result.md) вернут данные предыдущего ответа.
- Клиент переходит по заголовку `Location` при любом коде ответа. После ответа 302 или 303 запрос повторяется методом GET, после других ответов — тем же методом с тем же телом.

## Примеры

**Пример.** Код обновляет запись методом PUT:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setHeader('Content-Type', 'application/json');

if ($client->query(HttpClient::HTTP_PUT, 'https://postman-echo.com/put', Json::encode(['unit' => 'kg'])))
{
    $data = Json::decode($client->getResult());
    echo $client->getStatus() . ' ' . $data['json']['unit'];
}
```

Код выведет `200 kg`.

## Смотрите также

- [HttpClient::getResult](get-result.md)
- [HttpClient::getStatus](get-status.md)
