---
title: Настроить переход по редиректам HttpClient::setRedirect
description: Метод HttpClient::setRedirect включает или выключает переход по редиректам и задает их максимальное число.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setRedirect` включает или выключает переход по редиректам. Если переход включен, клиент сам запрашивает адрес из заголовка `Location`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setRedirect($value, $max = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `bool` | Значение `true` включает переход по редиректам, `false` выключает |
| max | `int` или `null` | Задает максимальное число переходов. По умолчанию — `null`, число не меняется. Начальное значение — `5` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Методы [get](get.md), [post](post.md), [head](head.md), [query](query.md) и [download](download.md) обрабатывают редиректы. Методы PSR-18 [sendRequest](send-request.md) и [sendAsyncRequest](send-async-request.md) их не обрабатывают.
- Клиент переходит по заголовку `Location` при любом коде ответа, а не только 3xx. После ответа 302 или 303 клиент повторяет запрос методом GET, после других ответов — тем же методом с тем же телом.
- При переходе клиент удаляет только заголовок `Host`. Заголовки `Authorization`, `Cookie` и другие уходят и на другой хост. Если адрес перехода может вести на чужой сервер, а запрос содержит учетные данные, выключите редиректы и проверьте `Location` сами.
- Если переходов больше максимума, запрос возвращает `false`, [getError](get-error.md) возвращает ошибку с ключом `REDIRECT`, а PHP выдает предупреждение `E_USER_WARNING`.
- Метод [getEffectiveUrl](get-effective-url.md) возвращает адрес после переходов.

## Примеры

**Пример.** Код выключает редиректы и читает адрес перехода:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setRedirect(false);
$client->get('https://postman-echo.com/cookies/set?unit=kg');

echo $client->getStatus() . ' ' . $client->getHeaders()->get('Location');
```

Код выведет `302 /cookies`.

## Смотрите также

- [HttpClient::getEffectiveUrl](get-effective-url.md)
