---
title: Создать перенаправление HttpResponse::redirectTo
description: Метод HttpResponse::redirectTo создает ответ Redirect на указанный адрес и переносит в него заголовки, cookie и статус текущего ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::redirectTo` создает ответ-перенаправление `Bitrix\Main\Engine\Response\Redirect` на указанный адрес. Метод переносит в новый ответ заголовки, cookie и статус текущего ответа методом [copyHeadersTo](copy-headers-to.md). Текущий ответ метод не отправляет.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
final public function redirectTo($url): HttpResponse
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает адрес перенаправления |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект `Redirect` со статусом `302 Found`. Чтобы выполнить перенаправление, верните объект из действия контроллера или передайте в `Application::getInstance()->end(0, $redirect)`.

## Особенности

- Если у текущего ответа задан статус, метод переносит его код в новый ответ вместо `302 Found`. Текст статуса при этом теряется. Например, после `setStatus(200)` перенаправление получит статус `200` без текста.
- Новый ответ получает те же объекты cookie, что и текущий. Если метод `addCookie` нового ответа сделает cookie сессионной, она изменится и в текущем ответе.
- Метод не переносит заголовки `Content-Type`, `Content-Length` и `Content-Encoding`.

## Примеры

**Пример.** Код создает перенаправление с cookie текущего ответа и выводит его статус и адрес:

```php
<?php
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Web\Cookie;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response->addCookie(new Cookie('UNIT', 'kg'));

$redirect = $response->redirectTo('/units/');

echo $redirect->getStatus() . ' ' . $redirect->getUrl() . ' ' . count($redirect->getCookies());
```

Код выведет `302 /units/ 1`.

## Смотрите также

- [HttpResponse::copyHeadersTo](copy-headers-to.md)
- [Контроллеры](../../../framework/controllers.md)
