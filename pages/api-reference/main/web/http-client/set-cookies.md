---
title: Задать cookie запроса HttpClient::setCookies
description: Метод HttpClient::setCookies задает заголовок Cookie из массива «имя — значение».
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setCookies` задает cookie для запросов клиента. Метод собирает заголовок `Cookie` из массива.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setCookies(array $cookies)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| cookies\* | `array` | Задает cookie. Ключ — имя, значение — строка. Метод пропускает пустой массив |

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Метод заменяет заголовок `Cookie` целиком. Cookie из прежнего вызова пропадут.
- Метод кодирует имена и значения функцией `rawurlencode`.
- Клиент не сохраняет cookie из ответа сам. Чтобы передать их в следующий запрос, прочитайте их методом [getCookies](get-cookies.md) и передайте в `setCookies`. При переходе по редиректу клиент тоже не передает cookie из ответа.

## Примеры

**Пример.** Код отправляет cookie и читает их в ответе сервиса:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setCookies(['unit' => 'kg', 'lang' => 'en']);
$data = Json::decode($client->get('https://postman-echo.com/headers'));

echo $data['headers']['cookie'];
```

Код выведет `unit=kg; lang=en`.

## Смотрите также

- [HttpClient::getCookies](get-cookies.md)
- [HttpCookies](../http-cookies/index.md)
