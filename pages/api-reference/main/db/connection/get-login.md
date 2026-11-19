---
title: Получить имя пользователя базы данных Connection::getLogin
description: Метод Connection::getLogin возвращает имя пользователя базы данных из настроек соединения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::getLogin` возвращает имя пользователя базы данных из ключа `login` настроек соединения в `.settings.php`. Метод не обращается к базе данных.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getLogin()
```

## Возвращаемое значение

Метод возвращает строку `string`. Если ключа `login` в настройках нет, метод возвращает пустую строку.

## Примеры

**Пример.** Код выводит имя пользователя, под которым работает соединение по умолчанию:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getLogin();
```

## Смотрите также

- [Connection::getHost](get-host.md)
- [Connection::getDatabase](get-database.md)
