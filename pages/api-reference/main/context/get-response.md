---
title: Получить ответ Context::getResponse
description: Метод Context::getResponse возвращает ответ текущего запроса, который ядро отправит клиенту в конце запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getResponse` возвращает ответ текущего запроса. Код добавляет в ответ заголовки и cookie, а метод `Application::end` в конце запроса отправляет ответ клиенту.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getResponse()
```

## Возвращаемое значение

Метод возвращает объект [HttpResponse](../http-response/index.md) для HTTP-запроса или другой наследник `Bitrix\Main\Response`. До вызова [initialize](initialize.md) метод возвращает `null`.

## Особенности

После выполнения действия контроллера ядро строит ответ действия. Если действие вернуло объект `HttpResponse`, ядро берет его, иначе собирает ответ `AjaxJson` с данными и ошибками. Затем ядро копирует в ответ действия заголовки, cookie и статус ответа контекста методом [HttpResponse::copyHeadersTo](../http-response/copy-headers-to.md) и заменяет ответ контекста методом [setResponse](set-response.md).

## Примеры

**Пример.** Код добавляет заголовок в ответ текущего запроса:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = Context::getCurrent()->getResponse();
$response->addHeader('X-Robots-Tag', 'noindex');

echo $response->getHeaders()->get('X-Robots-Tag');
```

Код выведет `noindex`. Ядро отправит заголовок клиенту вместе с ответом.

## Смотрите также

- [Context::setResponse](set-response.md)
- [HttpResponse](../http-response/index.md)
