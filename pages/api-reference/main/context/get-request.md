---
title: Получить запрос Context::getRequest
description: Метод Context::getRequest возвращает объект запроса HttpRequest с параметрами GET, POST, cookie и файлами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getRequest` возвращает объект текущего запроса. Через запрос код читает параметры GET и POST, cookie, заголовки и загруженные файлы.

Аналоги в классическом API — массивы `$_GET`, `$_POST`, `$_REQUEST` и `$_COOKIE`.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getRequest()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\HttpRequest` для HTTP-запроса или другой наследник `Bitrix\Main\Request`. До вызова [initialize](initialize.md) метод возвращает `null`.

## Примеры

**Пример.** Код читает параметр `code` из строки запроса:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$request = Context::getCurrent()->getRequest();
$code = (string)$request->getQuery('code');

echo $code !== '' ? $code : 'No code';
```

Для запроса `?code=kg` код выведет `kg`. При запуске из консоли код выведет `No code`.

## Смотрите также

- [Context::getServer](get-server.md)
- [Запрос и ответ](../../../framework/request-response.md)
