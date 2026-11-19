---
title: Получить учетные данные Uri::getUserInfo
description: Метод Uri::getUserInfo возвращает имя пользователя и пароль из адреса в формате user:password.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::getUserInfo` возвращает учетные данные из адреса в формате `user:password`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getUserInfo(): string
```

## Возвращаемое значение

Метод возвращает имя пользователя и пароль через двоеточие, оба в URL-кодировке. Если пароля нет, метод возвращает только имя. Если имени пользователя нет, метод возвращает пустую строку, даже если пароль задан.

## Примеры

**Пример.** Код читает учетные данные:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new Uri('https://api:secret@example.com/'))->getUserInfo();
```

Код выведет `api:secret`.

## Смотрите также

- [Uri::getAuthority](get-authority.md)
- [Uri::withUserInfo](with-user-info.md)
