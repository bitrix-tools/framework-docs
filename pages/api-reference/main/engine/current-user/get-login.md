---
title: Получить логин CurrentUser::getLogin
description: Метод CurrentUser::getLogin возвращает логин текущего пользователя из сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getLogin` возвращает логин текущего пользователя. Метод вызывает `CUser::GetLogin`, который читает значение из сессии. Ядро сохраняет его в сессию, когда пользователь авторизуется.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getLogin()
```

## Возвращаемое значение

Метод возвращает строку с логином или `null`, если пользователь не авторизован или объект не связан с `$USER`.

## Примеры

**Пример.** Код выводит логин или сообщение для гостя:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo CurrentUser::get()->getLogin() ?? 'Guest';
```

При запуске из консоли код выведет `Guest`.

## Смотрите также

- [CurrentUser::getEmail](get-email.md)
