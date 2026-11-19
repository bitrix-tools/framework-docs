---
title: Получить cookie из заголовков Set-Cookie HttpHeaders::getCookies
description: Метод HttpHeaders::getCookies разбирает все заголовки Set-Cookie и возвращает коллекцию HttpCookies.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getCookies` разбирает все заголовки `Set-Cookie` и возвращает cookie коллекцией. Метод нужен, чтобы прочитать cookie из ответа внешнего сервиса.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getCookies(): HttpCookies
```

## Возвращаемое значение

Метод возвращает новый объект [HttpCookies](../http-cookies/index.md). Если заголовков `Set-Cookie` нет, коллекция пустая.

## Примеры

**Пример.** Код разбирает ответ с двумя cookie:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = HttpHeaders::createFromString(
    "HTTP/1.1 200 OK\r\nSet-Cookie: unit=kg; path=/\r\nSet-Cookie: scale=metric\r\n"
);

echo $headers->getCookies()->implode();
```

Код выведет `unit=kg; scale=metric`.

## Смотрите также

- [HttpCookies](../http-cookies/index.md)
- [HttpHeaders::get](get.md)
