---
title: Скопировать заголовки в другой ответ HttpResponse::copyHeadersTo
description: Метод HttpResponse::copyHeadersTo копирует заголовки, cookie и статус текущего ответа в другой ответ и не заменяет то, что в нем уже есть.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::copyHeadersTo` копирует заголовки, cookie и статус текущего ответа в другой ответ. Приложение вызывает метод после выполнения действия контроллера для любого результата. Так заголовки и cookie, которые код добавил в ответ текущего запроса, переходят в ответ действия.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function copyHeadersTo(HttpResponse $response): HttpResponse
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| response\* | `Bitrix\Main\HttpResponse` | Задает ответ, в который метод копирует данные |

## Возвращаемое значение

Метод возвращает объект из параметра `response`.

Метод копирует данные по правилам:

- метод не копирует заголовок, у которого в целевом ответе уже есть непустое значение,
- метод не копирует заголовки `Content-Type`, `Content-Length` и `Content-Encoding`,
- метод добавляет cookie без замены, поэтому cookie с тем же именем, доменом и путем в целевом ответе остается,
- метод передает в целевой ответ те же объекты cookie, и `addCookie` может изменить их срок действия при отказе пользователя от постоянных cookie,
- метод копирует код статуса, если он задан, и заменяет статус целевого ответа. Текст статуса метод не копирует и у целевого ответа сбрасывает.

## Примеры

**Пример.** Код копирует заголовки в ответ, у которого уже есть заголовок с тем же именем:

```php
<?php
use Bitrix\Main\HttpResponse;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$source = new HttpResponse();
$source
    ->addHeader('X-Unit', 'kg')
    ->addHeader('X-Sort', 'code')
    ->addHeader('Content-Type', 'application/json')
;

$target = new HttpResponse();
$target->addHeader('X-Unit', 'g');

foreach ($source->copyHeadersTo($target)->getHeaders() as $name => $values)
{
    echo $name . ': ' . implode(', ', $values) . ' ';
}
```

Код выведет `X-Unit: g X-Sort: code`.

## Смотрите также

- [HttpResponse::redirectTo](redirect-to.md)
- [HttpResponse::getHeaders](get-headers.md)
