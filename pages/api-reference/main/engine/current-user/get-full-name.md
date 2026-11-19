---
title: Получить имя и фамилию CurrentUser::getFullName
description: Метод CurrentUser::getFullName возвращает имя и фамилию текущего пользователя через пробел.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getFullName` возвращает имя и фамилию текущего пользователя. Метод вызывает `CUser::GetFullName`, который читает значение из сессии. Ядро сохраняет его в сессию, когда пользователь авторизуется. Чтобы получить имя по формату из региональных настроек, используйте [getFormattedName](get-formatted-name.md).

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getFullName()
```

## Возвращаемое значение

Метод возвращает строку из полей `NAME` и `LAST_NAME` через пробел. Если одно из полей пустое, метод возвращает другое без пробела. Если пользователь не авторизован или объект не связан с `$USER`, метод возвращает `null`.

## Примеры

**Пример.** Код выводит имя и фамилию или логин, если имя пустое:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$user = CurrentUser::get();
$name = (string)$user->getFullName();

echo $name !== '' ? $name : (string)$user->getLogin();
```

## Смотрите также

- [CurrentUser::getFormattedName](get-formatted-name.md)
