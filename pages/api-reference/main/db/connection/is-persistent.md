---
title: Проверить постоянное подключение Connection::isPersistent
description: Метод Connection::isPersistent проверяет, использует ли соединение постоянное подключение к базе данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::isPersistent` проверяет флаг `Connection::PERSISTENT` в ключе `options` настроек соединения. Метод `disconnect` не закрывает постоянное подключение.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function isPersistent()
```

## Возвращаемое значение

Метод возвращает `true`, если в значении `options` установлен бит `1`, иначе `false`. Если ключа `options` в настройках нет, соединение использует значение `2`, и метод возвращает `false`.

Реализации открывают постоянное подключение по-разному.

| Реализация | Постоянное подключение |
| --- | --- |
| `MysqliConnection` | Добавляет к адресу сервера префикс `p:` |
| `PgsqlConnection` | Подключается функцией `pg_pconnect` |

## Примеры

**Пример.** Код проверяет режим подключения перед закрытием соединения:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

if ($connection->isPersistent())
{
    echo 'disconnect() will keep the connection open';
}
else
{
    echo 'disconnect() will close the connection';
}
```

## Смотрите также

- [Connection::isDeferred](is-deferred.md)
