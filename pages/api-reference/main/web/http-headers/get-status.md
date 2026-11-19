---
title: Получить статус HttpHeaders::getStatus
description: Метод HttpHeaders::getStatus возвращает код статуса HTTP или 0, если статус не задан.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getStatus` возвращает код статуса HTTP.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getStatus(): int
```

## Возвращаемое значение

Метод возвращает целое число. Если статус не задан, метод возвращает `0` — значение константы `HttpHeaders::DEFAULT_HTTP_STATUS`.

## Примеры

**Пример.** Код читает статус новой коллекции и коллекции из текста ответа:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$empty = new HttpHeaders();
$parsed = HttpHeaders::createFromString("HTTP/1.1 503 Service Unavailable\r\n");

echo $empty->getStatus() . ' ' . $parsed->getStatus();
```

Код выведет `0 503`.

## Смотрите также

- [HttpHeaders::setStatus](set-status.md)
- [HttpHeaders::getReasonPhrase](get-reason-phrase.md)
