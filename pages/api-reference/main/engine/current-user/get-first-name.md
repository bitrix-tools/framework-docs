---
title: Получить имя CurrentUser::getFirstName
description: Метод CurrentUser::getFirstName возвращает имя текущего пользователя из сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getFirstName` возвращает имя текущего пользователя — значение поля `NAME`. Метод вызывает `CUser::GetFirstName`, который читает значение из сессии. Ядро сохраняет его в сессию, когда пользователь авторизуется.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getFirstName()
```

## Возвращаемое значение

Метод возвращает строку с именем или `null`, если пользователь не авторизован или объект не связан с `$USER`.

## Примеры

**Пример.** Код выводит приветствие с именем пользователя:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$firstName = (string)CurrentUser::get()->getFirstName();

echo 'Hello' . ($firstName !== '' ? ', ' . $firstName : '');
```

При запуске из консоли код выведет `Hello`.

## Смотрите также

- [CurrentUser::getLastName](get-last-name.md)
- [CurrentUser::getFullName](get-full-name.md)
