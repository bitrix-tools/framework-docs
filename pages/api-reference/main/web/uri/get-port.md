---
title: Получить порт Uri::getPort
description: Метод Uri::getPort возвращает порт адреса или порт по умолчанию для схемы http и https.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getPort` возвращает порт адреса.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getPort(): ?int
```

## Возвращаемое значение

Метод возвращает порт из адреса. Если порт не задан, метод возвращает порт по умолчанию для схемы — `80` для `http` и `443` для `https`. Для других схем и относительного адреса без порта метод возвращает `null`.

## Особенности

Метод отличается от PSR-7. По PSR-7 метод возвращает `null` для стандартного порта схемы, а этот класс возвращает сам порт.

## Примеры

**Пример.** Код читает порт адреса с портом, адреса без порта и относительного адреса:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_export([
    (new Uri('https://example.com:8443/'))->getPort(),
    (new Uri('https://example.com/'))->getPort(),
    (new Uri('/units/'))->getPort(),
]);
```

Код выведет:

```text
array (
  0 => 8443,
  1 => 443,
  2 => NULL,
)
```

## Смотрите также

- [Uri::withPort](with-port.md)
- [Uri::getAuthority](get-authority.md)
