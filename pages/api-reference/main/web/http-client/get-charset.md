---
title: Получить кодировку ответа HttpClient::getCharset
description: Метод HttpClient::getCharset возвращает кодировку из атрибута charset заголовка Content-Type последнего ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getCharset` возвращает кодировку последнего ответа из атрибута `charset` заголовка `Content-Type`. Метод нужен, чтобы перекодировать ответ в кодировку сайта.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getCharset()
```

## Возвращаемое значение

Метод возвращает кодировку в том виде, в котором ее прислал сервер, или `null`, если атрибута нет. Метод вызывает [getCharset](../http-headers/get-charset.md) класса `HttpHeaders` и так же не убирает кавычки и не меняет регистр.

## Примеры

**Пример.** Код читает кодировку страницы:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->get('https://example.org/');

echo strtolower(trim($client->getCharset() ?? 'none', '"'));
```

Код выведет `utf-8`.

## Смотрите также

- [HttpClient::getContentType](get-content-type.md)
