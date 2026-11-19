---
title: Получить отчество CurrentUser::getSecondName
description: Метод CurrentUser::getSecondName возвращает отчество текущего пользователя из сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getSecondName` возвращает отчество текущего пользователя — значение поля `SECOND_NAME`. Метод вызывает `CUser::GetSecondName`, который читает значение из сессии. Ядро сохраняет его в сессию, когда пользователь авторизуется.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getSecondName()
```

## Возвращаемое значение

Метод возвращает строку с отчеством или `null`, если пользователь не авторизован или объект не связан с `$USER`.

## Примеры

**Пример.** Код собирает имя и отчество через пробел и пропускает пустые части:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$user = CurrentUser::get();

echo trim($user->getFirstName() . ' ' . $user->getSecondName());
```

## Смотрите также

- [CurrentUser::getFirstName](get-first-name.md)
- [CurrentUser::getFormattedName](get-formatted-name.md)
