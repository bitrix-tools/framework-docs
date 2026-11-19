---
title: Задать несколько заголовков запроса HttpClient::setHeaders
description: Метод HttpClient::setHeaders задает заголовки запроса из массива «имя — значение» с заменой прежних значений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setHeaders` задает несколько заголовков запроса. Для каждого элемента массива метод вызывает [setHeader](set-header.md) с заменой прежнего значения.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setHeaders(array $headers)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| headers\* | `array` | Задает заголовки. Ключ — имя, значение — строка |

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\InvalidArgumentException` | Имя или значение заголовка содержит недопустимые символы |

## Примеры

**Пример.** Код задает заголовки для API:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setHeaders([
    'Accept' => 'application/json',
    'X-Api-Key' => 'units-demo-key',
]);

echo $client->getRequestHeaders()->toString();
```

Код выведет:

```text
Accept: application/json
X-Api-Key: units-demo-key
```

## Смотрите также

- [HttpClient::setHeader](set-header.md)
