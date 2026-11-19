---
title: Получить типы служебных пользователей UserTable::getExternalUserTypes
description: Метод UserTable::getExternalUserTypes возвращает значения поля EXTERNAL_AUTH_ID, по которым ядро отличает служебных пользователей от реальных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `UserTable::getExternalUserTypes` возвращает типы служебных пользователей — значения поля `EXTERNAL_AUTH_ID`, например у ботов и пользователей почты. Пользователь с таким значением не считается реальным в вычисляемых полях `IS_REAL_USER` и `REAL_USER`.

Сигнатура метода в классе `Bitrix\Main\UserTable`:

```php
public static function getExternalUserTypes()
```

## Возвращаемое значение

Метод возвращает массив строк:

```php
[
    'bot',
    'email',
    '__controller',
    'replica',
    'imconnector',
    'sale',
    'saleanonymous',
    'shop',
    'call',
    'document_editor',
    'calendar_sharing',
    'im_guest',
    'rest_system',
]
```

Список задан в коде метода и не зависит от установленных модулей.

## Примеры

**Пример.** Код выбирает пять активных пользователей, кроме служебных:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$users = UserTable::getList([
    'select' => ['ID', 'LOGIN'],
    'filter' => [
        '=ACTIVE' => 'Y',
        [
            'LOGIC' => 'OR',
            '=EXTERNAL_AUTH_ID' => null,
            '!@EXTERNAL_AUTH_ID' => UserTable::getExternalUserTypes(),
        ],
    ],
    'limit' => 5,
]);

while ($user = $users->fetch())
{
    echo $user['ID'] . ' ' . $user['LOGIN'] . PHP_EOL;
}
```

Фильтр по вычисляемому полю `'=IS_REAL_USER' => 'Y'` дает тот же отбор.

## Смотрите также

- [UserTable::getIndexedFields](get-indexed-fields.md)
