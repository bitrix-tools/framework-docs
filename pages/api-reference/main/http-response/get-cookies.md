---
title: Получить cookie ответа HttpResponse::getCookies
description: Метод HttpResponse::getCookies возвращает массив объектов Cookie, которые ответ отправит клиенту.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::getCookies` возвращает cookie, которые ответ отправит клиенту. Метод не возвращает cookie из запроса. Их возвращает метод `HttpRequest::getCookie`.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function getCookies()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\Web\Cookie`. Ключ массива — имя, домен и путь cookie через точку, например `BITRIX_SM_UNIT../` для cookie без домена с путем `/`. Если cookie нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код добавляет две cookie и выводит их имена и значения:

```php
<?php
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Web\Cookie;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response
    ->addCookie(new Cookie('UNIT', 'kg'))
    ->addCookie(new Cookie('VIEW_MODE', 'list'))
;

foreach ($response->getCookies() as $cookie)
{
    echo $cookie->getName() . '=' . $cookie->getValue() . ' ';
}
```

При параметре `cookie_name`, равном `BITRIX_SM`, код выведет `BITRIX_SM_UNIT=kg BITRIX_SM_VIEW_MODE=list`.

## Смотрите также

- [HttpResponse::addCookie](add-cookie.md)
