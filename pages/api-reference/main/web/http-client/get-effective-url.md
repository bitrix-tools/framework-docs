---
title: Получить адрес после редиректов HttpClient::getEffectiveUrl
description: Метод HttpClient::getEffectiveUrl возвращает адрес последнего запроса после всех переходов по редиректам.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getEffectiveUrl` возвращает адрес, на который клиент отправил последний запрос. Если клиент переходил по редиректам, это адрес после последнего перехода. Иначе это исходный адрес.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getEffectiveUrl()
```

## Возвращаемое значение

Метод возвращает строку или `null`, если запросов не было.

## Примеры

**Пример.** Код узнает адрес после редиректа:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->get('https://postman-echo.com/cookies/set?unit=kg');

echo $client->getEffectiveUrl();
```

Код выведет `https://postman-echo.com/cookies`.

## Смотрите также

- [HttpClient::setRedirect](set-redirect.md)
