---
title: Получить cookie из ответа HttpClient::getCookies
description: Метод HttpClient::getCookies разбирает заголовки Set-Cookie последнего ответа и возвращает коллекцию HttpCookies.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getCookies` возвращает cookie, которые сервер задал в заголовках `Set-Cookie` последнего ответа. Метод нужен, чтобы передать cookie сессии в следующий запрос через [setCookies](set-cookies.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getCookies(): HttpCookies
```

## Возвращаемое значение

Метод возвращает объект [HttpCookies](../http-cookies/index.md). Метод `toArray` объекта возвращает массив «имя — значение».

## Особенности

Метод читает только последний ответ. Если клиент перешел по редиректу, cookie из промежуточного ответа пропадут. Чтобы их получить, выключите редиректы методом [setRedirect](set-redirect.md).

## Примеры

**Пример.** Код получает cookie и передает их в следующий запрос:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setRedirect(false);
$client->get('https://postman-echo.com/cookies/set?unit=kg');
$cookies = $client->getCookies()->toArray();

$next = new HttpClient();
$next->setCookies(['unit' => $cookies['unit']]);
$data = Json::decode($next->get('https://postman-echo.com/cookies'));

echo $data['cookies']['unit'];
```

Код выведет `kg`.

## Смотрите также

- [HttpClient::setCookies](set-cookies.md)
- [HttpCookies](../http-cookies/index.md)
