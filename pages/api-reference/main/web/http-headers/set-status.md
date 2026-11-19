---
title: Задать статус HttpHeaders::setStatus
description: Метод HttpHeaders::setStatus задает код и текст статуса HTTP.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::setStatus` задает код и текст статуса HTTP. Для ответа сайта используйте метод `setStatus` объекта [HttpResponse](../../http-response/index.md). Этот метод передает статус в коллекцию заголовков ответа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function setStatus(int $status, ?string $reasonPhrase = null): HttpHeaders
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| status\* | `int` | Задает код статуса, например `404` |
| reasonPhrase | `string` или `null` | Задает текст статуса, например `Not Found`. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает тот же объект `HttpHeaders`.

## Особенности

Метод не проверяет код и не подставляет текст статуса по коду. Без `reasonPhrase` метод [getReasonPhrase](get-reason-phrase.md) вернет пустую строку.

## Примеры

**Пример.** Код задает статус с текстом и без:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders();
$headers->setStatus(201);
$first = $headers->getStatus() . ' [' . $headers->getReasonPhrase() . ']';
$headers->setStatus(404, 'Not Found');

echo $first . ' ' . $headers->getStatus() . ' [' . $headers->getReasonPhrase() . ']';
```

Код выведет `201 [] 404 [Not Found]`.

## Смотрите также

- [HttpHeaders::getStatus](get-status.md)
- [HttpHeaders::getReasonPhrase](get-reason-phrase.md)
