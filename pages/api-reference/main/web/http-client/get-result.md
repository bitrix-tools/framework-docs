---
title: Получить тело ответа HttpClient::getResult
description: Метод HttpClient::getResult возвращает тело последнего ответа строкой или копирует его в поток.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getResult` возвращает тело последнего ответа. Метод нужен после [query](query.md), который возвращает только `true` или `false`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getResult()
```

## Возвращаемое значение

Метод возвращает тело ответа строкой. Если клиент еще не получил ни одного ответа, метод возвращает пустую строку. Если последний запрос не удался, метод возвращает тело предыдущего ответа.

Если задан поток [setOutputStream](set-output-stream.md), метод копирует тело в поток и возвращает пустую строку.

## Примеры

**Пример.** Код отправляет запрос DELETE и читает ответ:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();

if ($client->query(HttpClient::HTTP_DELETE, 'https://postman-echo.com/delete?unit=kg'))
{
    $data = Json::decode($client->getResult());
    echo $data['args']['unit'];
}
```

Код выведет `kg`.

## Смотрите также

- [HttpClient::query](query.md)
- [HttpClient::setOutputStream](set-output-stream.md)
