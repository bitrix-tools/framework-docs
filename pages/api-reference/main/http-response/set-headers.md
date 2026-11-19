---
title: Заменить коллекцию заголовков HttpResponse::setHeaders
description: Метод HttpResponse::setHeaders заменяет коллекцию заголовков ответа объектом HttpHeaders.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::setHeaders` заменяет коллекцию заголовков ответа и возвращает тот же объект. Заголовки и статус из прежней коллекции метод не переносит.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function setHeaders(Web\HttpHeaders $headers)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| headers\* | `Bitrix\Main\Web\HttpHeaders` | Задает новую коллекцию заголовков |

## Возвращаемое значение

Метод возвращает текущий объект.

Ответ хранит переданный объект, а не копию. Изменения в объекте после вызова попадают в ответ. Коллекция заголовков хранит и код статуса, поэтому после замены метод [getStatus](get-status.md) возвращает статус новой коллекции.

## Примеры

**Пример.** Код задает ответу заранее подготовленную коллекцию заголовков:

```php
<?php
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders();
$headers->add('Cache-Control', 'no-store');

$response = new HttpResponse();
$response->setHeaders($headers);

echo $response->getHeaders()->get('Cache-Control');
```

Код выведет `no-store`.

## Смотрите также

- [HttpResponse::getHeaders](get-headers.md)
- [HttpResponse::addHeader](add-header.md)
