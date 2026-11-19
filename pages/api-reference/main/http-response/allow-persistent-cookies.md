---
title: Запомнить выбор о постоянных cookie HttpResponse::allowPersistentCookies
description: Метод HttpResponse::allowPersistentCookies добавляет в ответ cookie STORE_COOKIES с согласием или отказом пользователя от постоянных cookie.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::allowPersistentCookies` запоминает, разрешил ли пользователь постоянные cookie. Метод добавляет в ответ cookie с именем из константы `HttpResponse::STORE_COOKIE_NAME`, то есть `STORE_COOKIES` с префиксом.

Метод [addCookie](add-cookie.md) читает этот выбор, если в главном модуле включен параметр `ask_to_store_cookies`.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function allowPersistentCookies($mode)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| mode\* | `bool` | Задает выбор пользователя. Только значение `true` разрешает постоянные cookie, любое другое значение запрещает |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

Для `true` метод добавляет постоянную cookie со значением `Y`, для другого значения — сессионную cookie со значением `N`. Метод заменяет прежнюю cookie выбора.

## Примеры

**Пример.** Код запоминает отказ от постоянных cookie и выводит добавленную cookie:

```php
<?php
use Bitrix\Main\HttpResponse;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response->allowPersistentCookies(false);

foreach ($response->getCookies() as $cookie)
{
    echo $cookie->getName() . '=' . $cookie->getValue() . ', expires ' . $cookie->getExpires();
}
```

При параметре `cookie_name`, равном `BITRIX_SM`, код выведет `BITRIX_SM_STORE_COOKIES=N, expires 0`.

## Смотрите также

- [HttpResponse::addCookie](add-cookie.md)
