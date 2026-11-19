---
title: Получить соединение с базой данных Application::getConnection
description: Статический метод Application::getConnection возвращает соединение с базой данных по имени из настроек .settings.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Статический метод `Application::getConnection` возвращает [соединение](../db/connection/index.md) с базой данных. Через соединение код выполняет SQL-запросы и получает [помощника SQL](../db/sql-helper/index.md) для экранирования.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public static function getConnection($name = "")
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| name | `string` | Задает имя соединения из секции `connections` файла `.settings.php`. По умолчанию — пустая строка, то есть соединение `default` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект соединения, например `Bitrix\Main\DB\MysqliConnection` для MySQL. Если соединения с таким именем нет в настройках, метод возвращает `null`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\Config\ConfigurationException` | Класс соединения из ключа `className` в `.settings.php` не найден |

## Особенности

- Метод создает соединение при первом вызове. Соединение подключается к серверу базы данных при первом SQL-запросе.
- Метод — короткая запись для `Application::getInstance()->getConnectionPool()->getConnection($name)`.

## Примеры

**Пример.** Код выполняет запрос через соединение по умолчанию:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$row = $connection->query('SELECT 1 + 1 AS SUM')->fetch();

echo get_class($connection) . ' ' . $row['SUM'];
```

Код выведет `Bitrix\Main\DB\MysqliConnection 2`. Для PostgreSQL класс соединения — `Bitrix\Main\DB\PgsqlConnection`.

## Смотрите также

- [Connection](../db/connection/index.md)
- [Application::getConnectionPool](get-connection-pool.md)
