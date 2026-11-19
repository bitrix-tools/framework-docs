---
title: Задать время ожидания подключения HttpClient::setTimeout
description: Метод HttpClient::setTimeout задает время ожидания подключения к серверу в секундах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setTimeout` задает время ожидания подключения к серверу. Метод [setStreamTimeout](set-stream-timeout.md) задает время ожидания чтения ответа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setTimeout($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `int` | Задает время в секундах. Метод приводит значение к целому числу. Начальное значение — `30` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

Запрос к внешнему сервису задерживает страницу. Для запросов во время показа страницы задавайте короткое время, например 5–10 секунд. Долгие запросы выносите в агенты.

## Примеры

**Пример.** Код задает короткое время ожидания и отправляет запрос:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setTimeout(5)->setStreamTimeout(10);
$client->get('https://example.org/');

echo $client->getStatus();
```

Код выведет `200`.

## Смотрите также

- [HttpClient::setStreamTimeout](set-stream-timeout.md)
