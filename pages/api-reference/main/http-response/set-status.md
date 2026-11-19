---
title: Задать статус ответа HttpResponse::setStatus
description: Метод HttpResponse::setStatus задает код и текст статуса HTTP-ответа, например 404 Not Found.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::setStatus` задает статус ответа и возвращает тот же объект. Метод сохраняет код и текст статуса в коллекции заголовков.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function setStatus($status)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| status\* | `string` или `int` | Задает код статуса и необязательный текст через пробел, например `'404 Not Found'` или `404` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает текущий объект.

Если строка не начинается с цифр, метод не меняет статус и не выбрасывает исключение. Метод не проверяет код и принимает любое число.

Метод [writeHeaders](write-headers.md) отправляет статус строкой протокола, например `HTTP/1.1 404 Not Found`. В режиме CGI без настройки `http_status` в конфигурации ядра метод отправляет заголовок `Status: 404 Not Found`.

## Примеры

**Пример.** Код задает статус «не найдено» и выводит код и текст статуса:

```php
<?php
use Bitrix\Main\HttpResponse;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response->setStatus('404 Not Found');

echo $response->getStatus() . ' ' . $response->getHeaders()->getReasonPhrase();
```

Код выведет `404 Not Found`.

## Смотрите также

- [HttpResponse::getStatus](get-status.md)
