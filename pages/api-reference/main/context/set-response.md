---
title: Заменить ответ Context::setResponse
description: Метод Context::setResponse заменяет ответ текущего запроса другим объектом Response.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::setResponse` заменяет ответ контекста и возвращает тот же контекст. Ядро вызывает метод после выполнения каждого действия контроллера и подставляет ответ действия.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function setResponse(Response $response)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| response\* | `Bitrix\Main\Response` | Задает новый ответ, например объект `Bitrix\Main\Engine\Response\Json` |

## Возвращаемое значение

Метод возвращает текущий контекст.

## Особенности

Метод не переносит заголовки и cookie прежнего ответа. Чтобы их сохранить, вызовите у прежнего ответа [HttpResponse::copyHeadersTo](../http-response/copy-headers-to.md) с новым ответом до замены.

## Примеры

**Пример.** Код заменяет ответ контекста ответом JSON и переносит в него заголовки прежнего ответа:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\Engine\Response\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$context = Context::getCurrent();
$context->getResponse()->addHeader('X-Unit', 'kg');

$json = $context->getResponse()->copyHeadersTo(new Json(['code' => 'kg']));
$context->setResponse($json);

echo get_class($context->getResponse()) . ' ' . $context->getResponse()->getHeaders()->get('X-Unit');
```

Код выведет `Bitrix\Main\Engine\Response\Json kg`.

## Смотрите также

- [Context::getResponse](get-response.md)
- [HttpResponse::copyHeadersTo](../http-response/copy-headers-to.md)
