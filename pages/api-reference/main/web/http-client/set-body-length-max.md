---
title: Ограничить размер тела ответа HttpClient::setBodyLengthMax
description: Метод HttpClient::setBodyLengthMax задает максимальный размер тела ответа и прерывает запрос, если ответ больше.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setBodyLengthMax` задает максимальный размер тела ответа в байтах. Если ответ больше, клиент прерывает чтение. Метод защищает от загрузки слишком большого файла по ссылке пользователя.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setBodyLengthMax($bodyLengthMax)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| bodyLengthMax\* | `int` | Задает размер в байтах. Значение `0` снимает ограничение. Начальное значение — `0` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

Если ответ больше ограничения, запрос возвращает `false`, а [getError](get-error.md) возвращает ошибку с ключом `NETWORK`.

## Примеры

**Пример.** Код ограничивает ответ 100 байтами:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setBodyLengthMax(100);
$result = $client->get('https://example.org/');

echo var_export($result, true) . ' ' . implode(',', array_keys($client->getError()));
```

Код выведет `false NETWORK`.

## Смотрите также

- [HttpClient::shouldFetchBody](should-fetch-body.md)
