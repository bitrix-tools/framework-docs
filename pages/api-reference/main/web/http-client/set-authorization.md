---
title: Задать Basic-авторизацию HttpClient::setAuthorization
description: Метод HttpClient::setAuthorization задает заголовок Authorization со схемой Basic.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setAuthorization` задает заголовок `Authorization` со схемой Basic. Заголовок содержит имя и пароль через двоеточие в кодировке Base64.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setAuthorization($user, $pass)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| user\* | `string` | Задает имя пользователя |
| pass\* | `string` | Задает пароль |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Если адрес запроса содержит учетные данные, например `https://api:secret@example.com/`, клиент заменит заголовок данными из адреса.
- Base64 не шифрует пароль. Отправляйте Basic-авторизацию только по HTTPS.
- При переходе по редиректу клиент отправляет заголовок и на другой хост. Если редирект может вести на чужой сервер, выключите редиректы методом [setRedirect](set-redirect.md).
- Для токена используйте [setHeader](set-header.md), например `setHeader('Authorization', 'Bearer ' . $token)`.

## Примеры

**Пример.** Код задает Basic-авторизацию:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setAuthorization('api', 'secret');

echo $client->getRequestHeaders()->get('Authorization');
```

Код выведет `Basic YXBpOnNlY3JldA==`.

## Смотрите также

- [HttpClient::setHeader](set-header.md)
