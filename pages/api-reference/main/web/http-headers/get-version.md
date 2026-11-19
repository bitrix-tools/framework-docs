---
title: Получить версию HTTP HttpHeaders::getVersion
description: Метод HttpHeaders::getVersion возвращает версию протокола HTTP, по умолчанию 1.1.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getVersion` возвращает версию протокола HTTP. Методы [setVersion](set-version.md) и [parseStatus](parse-status.md) задают версию.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getVersion(): ?string
```

## Возвращаемое значение

Метод возвращает строку без префикса `HTTP/`, например `1.1`. По умолчанию — `1.1`.

## Примеры

**Пример.** Код читает версию из строки статуса:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = HttpHeaders::createFromString("HTTP/1.0 200 OK\r\n");

echo $headers->getVersion();
```

Код выведет `1.0`.

## Смотрите также

- [HttpHeaders::setVersion](set-version.md)
