---
title: Получить текст статуса HttpHeaders::getReasonPhrase
description: Метод HttpHeaders::getReasonPhrase возвращает текст статуса HTTP, например Not Found.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getReasonPhrase` возвращает текст статуса HTTP, например `Not Found`. Методы [setStatus](set-status.md) и [parseStatus](parse-status.md) задают текст статуса.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getReasonPhrase(): string
```

## Возвращаемое значение

Метод возвращает строку. Если текст не задан, метод возвращает пустую строку.

## Примеры

**Пример.** Код читает текст статуса из ответа:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = HttpHeaders::createFromString("HTTP/1.1 429 Too Many Requests\r\n");

echo $headers->getReasonPhrase();
```

Код выведет `Too Many Requests`.

## Смотрите также

- [HttpHeaders::getStatus](get-status.md)
