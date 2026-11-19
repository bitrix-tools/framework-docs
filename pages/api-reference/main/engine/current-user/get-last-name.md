---
title: Получить фамилию CurrentUser::getLastName
description: Метод CurrentUser::getLastName возвращает фамилию текущего пользователя из сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getLastName` возвращает фамилию текущего пользователя — значение поля `LAST_NAME`. Метод вызывает `CUser::GetLastName`, который читает значение из сессии. Ядро сохраняет его в сессию, когда пользователь авторизуется.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getLastName()
```

## Возвращаемое значение

Метод возвращает строку с фамилией или `null`, если пользователь не авторизован или объект не связан с `$USER`.

## Примеры

**Пример.** Код выводит фамилию пользователя или прочерк:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo CurrentUser::get()->getLastName() ?? '-';
```

При запуске из консоли код выведет `-`.

## Смотрите также

- [CurrentUser::getFirstName](get-first-name.md)
- [CurrentUser::getSecondName](get-second-name.md)
