---
title: Получить имя класса CurrentUser::className
description: Метод CurrentUser::className возвращает полное имя класса CurrentUser.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::className` возвращает полное имя класса. Ядро использует его, чтобы связать параметр действия контроллера с объектом текущего пользователя.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public static function className(): string
```

## Возвращаемое значение

Метод возвращает строку `Bitrix\Main\Engine\CurrentUser`.

## Примеры

**Пример.** Код выводит имя класса:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo CurrentUser::className();
```

Код выведет `Bitrix\Main\Engine\CurrentUser`.

## Смотрите также

- [CurrentUser::get](get.md)
