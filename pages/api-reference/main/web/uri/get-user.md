---
title: Получить имя пользователя Uri::getUser
description: Метод Uri::getUser возвращает имя пользователя из адреса в URL-кодировке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getUser` возвращает имя пользователя из адреса вида `https://user:password@example.com/`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getUser()
```

## Возвращаемое значение

Метод кодирует имя функцией `rawurlencode` и возвращает строку. Например, пробел станет `%20`. Если имени нет, метод возвращает пустую строку. Чтобы получить исходное имя, раскодируйте значение функцией `rawurldecode`.

## Примеры

**Пример.** Код читает имя пользователя:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://api%20user:secret@example.com/');

echo $uri->getUser() . ' ' . rawurldecode($uri->getUser());
```

Код выведет `api%20user api user`.

## Смотрите также

- [Uri::setUser](set-user.md)
- [Uri::getUserInfo](get-user-info.md)
