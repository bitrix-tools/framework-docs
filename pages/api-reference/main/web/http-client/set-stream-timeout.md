---
title: Задать время ожидания чтения ответа HttpClient::setStreamTimeout
description: Метод HttpClient::setStreamTimeout задает время ожидания данных при чтении ответа в секундах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setStreamTimeout` задает время ожидания данных при чтении ответа. Если сервер не присылает данные дольше этого времени, клиент прерывает запрос.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setStreamTimeout($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `int` | Задает время в секундах. Значение `0` снимает ограничение. Начальное значение — `60` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Примеры

**Пример.** Код прерывает запрос к медленному сервису:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setStreamTimeout(1);
$result = $client->get('https://postman-echo.com/delay/3');

echo var_export($result, true) . ' ' . implode(',', array_keys($client->getError()));
```

Код выведет `false NETWORK`.

## Смотрите также

- [HttpClient::setTimeout](set-timeout.md)
- [HttpClient::getError](get-error.md)
