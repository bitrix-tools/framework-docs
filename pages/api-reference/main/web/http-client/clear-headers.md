---
title: Удалить заголовки запроса HttpClient::clearHeaders
description: Метод HttpClient::clearHeaders удаляет все заголовки, которые задали для запросов клиента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::clearHeaders` удаляет все заголовки, которые задали методы [setHeader](set-header.md), [setCookies](set-cookies.md) и [setAuthorization](set-authorization.md). Метод нужен, чтобы отправить через тот же клиент запрос к другому сервису без прежних заголовков.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function clearHeaders()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

При следующем запросе клиент снова добавит стандартные заголовки, например `Host`, `Connection`, `Accept` и `Accept-Language`.

## Примеры

**Пример.** Код удаляет заголовок авторизации:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setAuthorization('api', 'secret');
$client->clearHeaders();

var_dump($client->getRequestHeaders()->has('Authorization'));
```

Код выведет `bool(false)`.

## Смотрите также

- [HttpClient::setHeader](set-header.md)
