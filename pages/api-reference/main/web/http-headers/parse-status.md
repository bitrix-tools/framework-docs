---
title: Прочитать строку статуса HttpHeaders::parseStatus
description: Метод HttpHeaders::parseStatus читает версию HTTP, код и текст статуса из строки вида HTTP/1.1 200 OK.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::parseStatus` читает версию HTTP, код и текст статуса из строки статуса, например `HTTP/1.1 200 OK`. Метод [createFromString](create-from-string.md) вызывает его для первой строки ответа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function parseStatus(string $status): HttpHeaders
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| status\* | `string` | Задает строку статуса |

## Возвращаемое значение

Метод возвращает тот же объект `HttpHeaders`.

## Особенности

- Если строка не начинается с `HTTP/<версия> <код>`, метод ничего не меняет.
- Текст статуса необязателен. Без него [getReasonPhrase](get-reason-phrase.md) вернет пустую строку.

## Примеры

**Пример.** Код читает строку статуса HTTP/2:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = (new HttpHeaders())->parseStatus('HTTP/2 302');

echo $headers->getVersion() . ' ' . $headers->getStatus();
```

Код выведет `2 302`.

## Смотрите также

- [HttpHeaders::createFromString](create-from-string.md)
- [HttpHeaders::setStatus](set-status.md)
