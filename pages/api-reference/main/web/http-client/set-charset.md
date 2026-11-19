---
title: Задать кодировку POST-запроса HttpClient::setCharset
description: Метод HttpClient::setCharset добавляет кодировку в заголовок Content-Type POST-запроса с данными формы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setCharset` задает кодировку тела POST-запроса. Клиент добавляет ее в заголовок `Content-Type`, например `application/x-www-form-urlencoded; charset=UTF-8`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setCharset($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает кодировку, например `UTF-8` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Метод не перекодирует данные. Он только указывает кодировку в заголовке.
- Клиент добавляет кодировку, только если заголовок `Content-Type` не задан, и только для метода POST.

## Примеры

**Пример.** Код отправляет форму с указанием кодировки:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setCharset('UTF-8');
$data = Json::decode($client->post('https://postman-echo.com/post', ['unit' => 'kg']));

echo $data['headers']['content-type'];
```

Код выведет `application/x-www-form-urlencoded; charset=UTF-8`.

## Смотрите также

- [HttpClient::post](post.md)
