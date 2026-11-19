---
title: Получить адрес электронной почты CurrentUser::getEmail
description: Метод CurrentUser::getEmail возвращает адрес электронной почты текущего пользователя из сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getEmail` возвращает адрес электронной почты текущего пользователя. Метод вызывает `CUser::GetEmail`, который читает значение из сессии. Ядро сохраняет его в сессию, когда пользователь авторизуется.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getEmail()
```

## Возвращаемое значение

Метод возвращает строку с адресом или `null`, если пользователь не авторизован или объект не связан с `$USER`.

## Примеры

**Пример.** Код выводит адрес электронной почты, если он есть:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$email = (string)CurrentUser::get()->getEmail();

echo $email !== '' ? $email : 'No email';
```

При запуске из консоли код выведет `No email`.

## Смотрите также

- [CurrentUser::getLogin](get-login.md)
