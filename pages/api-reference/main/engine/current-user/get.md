---
title: Получить текущего пользователя CurrentUser::get
description: Метод CurrentUser::get возвращает объект текущего пользователя, связанный с глобальным объектом $USER.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::get` возвращает объект текущего пользователя. Метод связывает объект с глобальным объектом `$USER`.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public static function get(): self
```

## Возвращаемое значение

Метод возвращает новый объект `CurrentUser` при каждом вызове. Если глобальный `$USER` не объект `CUser`, например до подключения пролога, объект не связан с пользователем, и его методы возвращают пустые значения.

Объект читает данные из `$USER` в момент вызова своих методов. Если пользователь авторизуется или выйдет позже, объект вернет новые данные.

## Примеры

**Пример.** Код проверяет, авторизован ли пользователь:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$user = CurrentUser::get();

echo (int)$user->getId() > 0 ? 'Authorized' : 'Guest';
```

При запуске из консоли код выведет `Guest`.

## Смотрите также

- [CurrentUser::getId](get-id.md)
