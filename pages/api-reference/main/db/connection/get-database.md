---
title: Получить имя базы данных Connection::getDatabase
description: Метод Connection::getDatabase возвращает имя базы данных из настроек соединения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::getDatabase` возвращает имя базы данных из ключа `database` настроек соединения в `.settings.php`. Метод не обращается к базе данных.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getDatabase()
```

## Возвращаемое значение

Метод возвращает строку `string`. Если ключа `database` в настройках нет, метод возвращает пустую строку.

Метод не учитывает смену базы данных после подключения, например через `MysqliConnection::selectDatabase`. Он возвращает значение из настроек.

## Примеры

**Пример.** Код выводит имя базы данных соединения по умолчанию:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getDatabase();
```

## Смотрите также

- [Connection::getHost](get-host.md)
- [Connection::getLogin](get-login.md)
