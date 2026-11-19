---
title: Получить заголовки запроса HttpClient::getRequestHeaders
description: Метод HttpClient::getRequestHeaders возвращает заголовки, которые клиент отправит или уже отправил.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getRequestHeaders` возвращает заголовки запроса. Метод нужен для отладки — проверить, какие заголовки отправил клиент.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getRequestHeaders(): HttpHeaders
```

## Возвращаемое значение

Метод возвращает объект [HttpHeaders](../http-headers/index.md).

- До первого запроса — заголовки, которые задали [setHeader](set-header.md) и другие методы. Изменения этого объекта попадут в следующие запросы.
- После запроса — заголовки последнего отправленного запроса, в том числе те, которые клиент добавил сам, например `Host`.

## Примеры

**Пример.** Код выводит заголовки отправленного запроса:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setHeader('X-Units-Client', 'catalog');
$client->get('https://example.org/');

echo $client->getRequestHeaders()->toString();
```

Код выведет:

```text
X-Units-Client: catalog
Host: example.org
Connection: close
Accept: */*
Accept-Language: en
```

## Смотрите также

- [HttpClient::setHeader](set-header.md)
- [HttpClient::getHeaders](get-headers.md)
