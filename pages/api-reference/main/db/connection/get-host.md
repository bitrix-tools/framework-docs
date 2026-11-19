---
title: Получить адрес сервера Connection::getHost
description: Метод Connection::getHost возвращает адрес сервера базы данных из настроек соединения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::getHost` возвращает адрес сервера базы данных из ключа `host` настроек соединения в `.settings.php`. Метод не обращается к базе данных.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getHost()
```

## Возвращаемое значение

Метод возвращает строку `string` в том виде, в каком она записана в настройках, например `localhost` или `db:3306`. Порт после двоеточия соединение использует при подключении. Если ключа `host` в настройках нет, метод возвращает пустую строку.

## Примеры

**Пример.** Код выводит адрес сервера и имя базы данных соединения по умолчанию:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

echo $connection->getHost() . ' / ' . $connection->getDatabase();
```

## Смотрите также

- [Connection::getLogin](get-login.md)
- [Connection::getDatabase](get-database.md)
