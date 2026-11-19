---
title: Задать сборщик ответа HttpClient::setResponseBuilder
description: Метод HttpClient::setResponseBuilder задает объект, который создает ответ из заголовков сервера.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setResponseBuilder` задает объект, который создает ответ `Bitrix\Main\Web\Http\Response` из текста заголовков сервера. Метод нужен, чтобы изменить ответ до того, как его получит код, например добавить заголовок или подменить поток тела.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setResponseBuilder(Http\ResponseBuilderInterface $responseBuilder)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| responseBuilder\* | `Bitrix\Main\Web\Http\ResponseBuilderInterface` | Задает сборщик. Интерфейс содержит метод `createFromString(string $response): Response` |

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

По умолчанию клиент использует `Bitrix\Main\Web\Http\ResponseBuilder`. Он собирает ответ, который пришел частями, и распаковывает gzip. Наследуйте свой сборщик от этого класса, чтобы сохранить эту обработку.

## Примеры

**Пример.** Код добавляет в каждый ответ служебный заголовок:

```php
<?php
use Bitrix\Main\Web\Http\Response;
use Bitrix\Main\Web\Http\ResponseBuilder;
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitsResponseBuilder extends ResponseBuilder
{
    public function createFromString(string $response): Response
    {
        return parent::createFromString($response)->withHeader('X-Units-Checked', 'yes');
    }
}

$client = new HttpClient();
$client->setResponseBuilder(new UnitsResponseBuilder());
$client->get('https://example.org/');

echo $client->getHeaders()->get('X-Units-Checked');
```

Код выведет `yes`.

## Смотрите также

- [HttpClient::getResponse](get-response.md)
