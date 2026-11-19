---
title: Задать версию HTTP HttpClient::setVersion
description: Метод HttpClient::setVersion задает версию протокола HTTP для запросов клиента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setVersion` задает версию протокола HTTP для запросов. Метод `getProtocolVersion` объекта из [getResponse](get-response.md) возвращает версию ответа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setVersion($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает версию — `HttpClient::HTTP_1_0` или `HttpClient::HTTP_1_1`. Начальное значение — `'1.1'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

Метод не проверяет значение. Версия 1.0 нужна для старых серверов, которые не поддерживают ответы частями.

## Примеры

**Пример.** Код отправляет запрос по HTTP/1.0:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setVersion(HttpClient::HTTP_1_0);
$client->get('https://example.org/');

echo $client->getStatus();
```

Код выведет `200`.

## Смотрите также

- [HttpClient::getResponse](get-response.md)
