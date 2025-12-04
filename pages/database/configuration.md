---
title: Конфигурация
description: 'Конфигурация. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

Конфигурация подключения к базе данных в Bitrix Framework хранится в файле `/bitrix/.settings.php` в секции `connections`:

```php
'connections' => [
    'value' => [
        // Основное соединение с базой данных
        'default' => [
            'className' => \Bitrix\Main\DB\MysqliConnection::class, // Используем драйвер MySQLi для соединения
            'host' => 'localhost',     // Хост базы данных
            'database' => 'busik',     // Имя базы данных
            'login' => 'db_user',      // Имя пользователя БД
            'password' => '***',       // Пароль пользователя 
            'options' => 2,            // Дополнительные опции соединения (2 - отложенное соединение)
        ],
    ],
    'readonly' => true, // Запрещает изменение настроек во время выполнения скрипта
],
```

{% note warning "" %}

Установите параметр  `readonly => true` для секции `connections`, чтобы предотвратить изменение настроек подключения во время работы.

{% endnote %}

## Как настроить подключение к БД

Параметр `className` определяет класс для работы с базой данных.

Основные СУБД:

-  MySQL -- `\Bitrix\Main\DB\MysqliConnection`, требует расширение `mysqli`,

-  PostgreSQL -- `\Bitrix\Main\DB\PgsqlConnection`, требует расширение `pgsql` .

Дополнительные СУБД:

-  MS SQL -- `\Bitrix\Main\DB\MssqlConnection`, требует расширение `sqlsrv`,

-  Oracle -- `\Bitrix\Main\DB\OracleConnection`, требует расширение `oci8`.

Key-value хранилища:

-  HandlerSocket -- `\Bitrix\Main\Data\HsphpReadConnection`, требует библиотеку `HSPHP`,

-  Memcache -- `\Bitrix\Main\Data\MemcacheConnection`, требует расширение `memcache`,

-  Memcached --  `\Bitrix\Main\Data\MemcachedConnection`, требует расширение `memcached`,

-  Redis -- `\Bitrix\Main\Data\RedisConnection`, требует расширение  `redis`.

## Как управлять режимом подключения

Параметр `options` управляет режимом подключения к базе данных. Принимает числовые флаги:

-  `1` (`Connection::PERSISTENT`) -- постоянное соединение, не закрывается после выполнения запроса,

-  `2` (`Connection::DEFERRED`) -- отложенное соединение, устанавливается только при первом запросе.

Флаги можно объединять через битовые операции:

-  `3` = `1 | 2` -- `PERSISTENT` + `DEFERRED`,

-  `0` -- обычное соединение, без специальных режимов.

## Как подключить HandlerSocket

HandlerSocket -- это плагин для MySQL, который работает без SQL-запросов. Он снижает нагрузку на сервер и ускоряет обработку данных.

Добавьте указание на HandlerSocket в основное соединение:

```php
'default' => [
    'className' => \Bitrix\Main\DB\MysqliConnection::class,
    'handlersocket' => [
        'read' => 'handlersocket', // Использовать HandlerSocket для чтения
    ],
],
```

Добавьте отдельное соединение для HandlerSocket с указанием хоста и порта:

```php
'handlersocket' => [
    'className' => \Bitrix\Main\Data\HsphpReadConnection::class,
    'host' => 'localhost',  // Хост сервера HandlerSocket
    'port' => 9998,        // Порт для чтения (обычно 9998)
    'port_write' => 9999,  // Порт для записи (обычно 9999)
],
```

О том, как HandlerSocket ускоряет работу с БД, читайте в статье [HandlerSocket](./handlersocket)**.**

## Как добавить дополнительные соединения

Чтобы добавить соединение с БД, дополните секцию `connections` в файле конфигурации `/bitrix/.settings.php`:

```php
'connections' => [
    'value' => [
        // Основное соединение с базой данных
        'default' => [
            'className' => \Bitrix\Main\DB\MysqliConnection::class, // Используем драйвер MySQLi для соединения
            'host' => 'localhost',     // Хост базы данных
            'database' => 'busik',     // Имя базы данных
            'login' => 'db_user',      // Имя пользователя 	БД
            'password' => '***',       // Пароль пользователя 
            'options' => 2,            // Дополнительные опции соединения (2 — постоянное соединение)
        ],
        
        // Дополнительное соединение с Redis для кеширования
        'redis' => [
            'className' => \Bitrix\Main\Data\RedisConnection::class, // Используем драйвер Redis
            'host' => 'rediska',       // Хост Redis сервера
            'port' => '12345',         // Порт для подключения к Redis
        ],
    ],
    'readonly' => true, // Запрещает изменение настроек во время выполнения скрипта
],
```

Получить подключения в коде:

```php
// Подключение по умолчанию (default)
$db = \Bitrix\Main\Application::getConnection();

// Явное указание подключения
$db = \Bitrix\Main\Application::getConnection('default');
$redis = \Bitrix\Main\Application::getConnection('redis');
```
