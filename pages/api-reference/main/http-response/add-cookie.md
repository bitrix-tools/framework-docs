---
title: Добавить cookie HttpResponse::addCookie
description: Метод HttpResponse::addCookie добавляет в ответ объект Cookie, заменяет cookie с тем же именем, доменом и путем и учитывает отказ пользователя от постоянных cookie.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::addCookie` добавляет cookie в ответ и возвращает тот же объект. Метод [writeHeaders](write-headers.md) отправляет cookie клиенту.

Аналог в классическом API — метод `$APPLICATION->set_cookie`.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function addCookie(Web\Cookie $cookie, $replace = true, $checkExpires = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| cookie\* | `Bitrix\Main\Web\Cookie` | Задает объект cookie, который метод добавит в ответ |
| replace | `bool` | Задает, заменять ли cookie с тем же именем, доменом и путем. Если передать `false`, метод оставляет прежнюю cookie. По умолчанию — `true` |
| checkExpires | `bool` | Задает, проверять ли согласие пользователя на постоянные cookie. По умолчанию — `true` |

Типы `replace` и `checkExpires` в таблице описывают назначение аргументов. Сигнатура PHP объявляет только тип `cookie`.

## Возвращаемое значение

Метод возвращает текущий объект.

Метод хранит cookie по ключу из имени, домена и пути. Две cookie с одним именем и разными путями — разные cookie.

## Особенности

- Если в главном модуле включен параметр `ask_to_store_cookies` и пользователь не разрешил постоянные cookie, метод превращает постоянную cookie в сессионную и задает срок действия `0`. Метод меняет переданный объект. Согласие пользователя запоминает метод [allowPersistentCookies](allow-persistent-cookies.md).
- Конструктор `Cookie` по умолчанию добавляет к имени значение параметра `cookie_name` главного модуля и знак `_`. По умолчанию параметр равен `BITRIX_SM`.

## Примеры

**Пример.** Код добавляет cookie на 30 дней и выводит имя, под которым ее отправит ответ:

```php
<?php
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Web\Cookie;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response->addCookie(new Cookie('UNIT', 'kg', time() + 86400 * 30));

foreach ($response->getCookies() as $cookie)
{
    echo $cookie->getName() . '=' . $cookie->getValue();
}
```

При параметре `cookie_name`, равном `BITRIX_SM`, код выведет `BITRIX_SM_UNIT=kg`.

**Пример.** Код добавляет cookie в ответ текущего запроса:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\Web\Cookie;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cookie = new Cookie('VIEW_MODE', 'list');
$cookie->setHttpOnly(true);

Context::getCurrent()->getResponse()->addCookie($cookie);

echo count(Context::getCurrent()->getResponse()->getCookies());
```

Ответ текущего запроса вместе с cookie отправляет метод `Application::end`. Его вызывает эпилог страницы, поэтому в скрипте без эпилога вызовите `Application::getInstance()->end()`. Код выведет число cookie в ответе, например `1`.

## Смотрите также

- [HttpResponse::getCookies](get-cookies.md)
- [HttpResponse::allowPersistentCookies](allow-persistent-cookies.md)
- [Cookie](../../../framework/cookies.md)
