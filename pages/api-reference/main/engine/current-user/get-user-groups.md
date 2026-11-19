---
title: Получить группы пользователя CurrentUser::getUserGroups
description: Метод CurrentUser::getUserGroups возвращает идентификаторы групп текущего пользователя из сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getUserGroups` возвращает идентификаторы групп текущего пользователя. Метод вызывает `CUser::GetUserGroupArray`, который читает группы, сохраненные в сессии при авторизации. Чтобы получить группы произвольного пользователя, используйте [UserTable::getUserGroupIds](../../user-table/get-user-group-ids.md).

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getUserGroups(): array
```

## Возвращаемое значение

Метод возвращает массив идентификаторов групп. Для неавторизованного посетителя метод возвращает `[2]` — группу «Все пользователи (в том числе неавторизованные)». Если объект не связан с `$USER`, метод возвращает пустой массив.

## Примеры

**Пример.** Код проверяет, входит ли пользователь в группу с идентификатором `5`:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$groups = CurrentUser::get()->getUserGroups();

var_dump(in_array(5, array_map('intval', $groups), true));
```

## Смотрите также

- [CurrentUser::isAdmin](is-admin.md)
- [UserTable::getUserGroupIds](../../user-table/get-user-group-ids.md)
