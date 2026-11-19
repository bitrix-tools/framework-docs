---
title: Отправить POST-запрос HttpClient::post
description: Метод HttpClient::post отправляет POST-запрос с данными формы, строкой, потоком или в формате multipart/form-data и возвращает тело ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::post` отправляет POST-запрос и возвращает тело ответа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function post($url, $postData = null, $multipart = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает абсолютный адрес |
| postData | `array`, `string`, `resource` или `null` | Задает тело запроса. Метод кодирует массив как данные формы, отправляет строку как есть и читает ресурс потоком. По умолчанию — `null`, пустое тело |
| multipart | `bool` | Значение `true` кодирует массив как `multipart/form-data`. Тогда файл передают ресурсом или массивом с ключами `resource` или `content`, `filename` и `contentType`. По умолчанию — `false` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тело ответа строкой или `false`, если запрос не удался.

## Особенности

- Если заголовок `Content-Type` не задан, метод отправляет `application/x-www-form-urlencoded`. Для JSON задайте заголовок методом [setHeader](set-header.md) и передайте строку.
- В режиме `multipart` метод сам задает заголовок `Content-Type` с разделителем частей.
- Метод переходит по заголовку `Location` при любом коде ответа. После ответа 302 или 303 клиент повторяет запрос методом GET, после других ответов — методом POST с тем же телом. Если API отвечает на создание записи кодом 201 с `Location`, выключите редиректы методом [setRedirect](set-redirect.md).

## Примеры

**Пример.** Код отправляет JSON и читает ответ:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setHeader('Content-Type', 'application/json');
$body = $client->post('https://postman-echo.com/post', Json::encode(['unit' => 'kg', 'count' => 3]));

$data = Json::decode($body);
echo $data['json']['unit'] . ' ' . $data['json']['count'];
```

Код выведет `kg 3`.

**Пример.** Код отправляет форму с файлом:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$body = $client->post('https://postman-echo.com/post', [
    'catalog' => 'units',
    'file' => ['content' => "code;name\nkg;Kilogram", 'filename' => 'units.csv', 'contentType' => 'text/csv'],
], true);

$data = Json::decode($body);
echo $data['form']['catalog'] . ' ' . implode(',', array_keys($data['files']));
```

Код выведет `units units.csv`.

## Смотрите также

- [HttpClient::get](get.md)
- [HttpClient::setCharset](set-charset.md)
- [HttpClient::query](query.md)
