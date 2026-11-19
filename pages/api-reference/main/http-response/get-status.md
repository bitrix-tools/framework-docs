---
title: Получить код статуса HttpResponse::getStatus
description: Метод HttpResponse::getStatus возвращает код статуса HTTP-ответа или 0, если статус не задан.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::getStatus` возвращает код статуса ответа. Метод коллекции заголовков `getReasonPhrase` возвращает текст статуса, например `$response->getHeaders()->getReasonPhrase()`.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function getStatus()
```

## Возвращаемое значение

Метод возвращает целое число. Если статус не задан, метод возвращает `0` — значение константы `HttpHeaders::DEFAULT_HTTP_STATUS`. С таким значением метод [writeHeaders](write-headers.md) не отправляет строку статуса.

## Примеры

**Пример.** Код выводит код статуса до и после вызова `setStatus`:

```php
<?php
use Bitrix\Main\HttpResponse;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
echo $response->getStatus() . ' ';

$response->setStatus(201);
echo $response->getStatus();
```

Код выведет `0 201`.

## Смотрите также

- [HttpResponse::setStatus](set-status.md)
