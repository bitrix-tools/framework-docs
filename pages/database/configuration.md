---
title: Конфигурация
description: 'Конфигурация. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

Конфигурация подключения к базе данных в Bitrix Framework хранится в файле `/bitrix/.settings.php` в секции `connections`.

```php
'connections' => [
    'value' => [
        // Основное соединение с базой данных
        'default' => [
            'className' => \Bitrix\Main\DB\MysqliConnection::class, // Используем драйвер MySQLi для соединения
            'host' => 'localhost', // Хост базы данных
            'database' => 'bx', // Имя базы данных
            'login' => 'db_user', // Имя пользователя БД
            'password' => '***', // Пароль пользователя 
            'options' => 2, // Дополнительные опции соединения (2 — отложенное соединение)
        ],
    ],
    'readonly' => true, // Запрещает изменение настроек во время выполнения скрипта
],
```

{% note warning "" %}

Установите параметр  `readonly => true` для секции `connections`, чтобы предотвратить изменение настроек подключения во время работы.

{% endnote %}

## Классы для работы с базой данных

Параметр `className` определяет класс для работы с базой данных.

Основные СУБД:

-  MySQL — `\Bitrix\Main\DB\MysqliConnection`, требует расширение `mysqli`,

-  PostgreSQL — `\Bitrix\Main\DB\PgsqlConnection`, требует расширение `pgsql` .

Дополнительные СУБД:

-  MS SQL — `\Bitrix\Main\DB\MssqlConnection`, требует расширение `sqlsrv`,

-  Oracle — `\Bitrix\Main\DB\OracleConnection`, требует расширение `oci8`.

Key-value хранилища:

-  Memcache — `\Bitrix\Main\Data\MemcacheConnection`, требует расширение `memcache`,

-  Memcached —  `\Bitrix\Main\Data\MemcachedConnection`, требует расширение `memcached`,

-  Redis — `\Bitrix\Main\Data\RedisConnection`, требует расширение `redis`,

-  HandlerSocket — `\Bitrix\Main\Data\HsphpReadConnection`, требует библиотеку `HSPHP`.

## Режимы подключения

Параметр `options` управляет режимом подключения к базе данных. Принимает числовые флаги:

-  `1` (`Connection::PERSISTENT`) — постоянное соединение, не закрывается после выполнения запроса,

-  `2` (`Connection::DEFERRED`) — отложенное соединение, устанавливается только при первом запросе.

Флаги можно объединять через битовые операции:

-  `3` = `1 | 2` — `PERSISTENT` + `DEFERRED`,

-  `0` — обычное соединение, без специальных режимов.

## Добавить дополнительное соединение

Чтобы добавить дополнительное соединение с базой данных, дополните секцию `connections` в файле конфигурации `/bitrix/.settings.php`.

```php
'connections' => [
    'value' => [
        // Основное соединение с базой данных
        'default' => [
            'className' => \Bitrix\Main\DB\MysqliConnection::class,
            'host' => 'localhost',
            'database' => 'bx',
            'login' => 'db_user',
            'password' => '***',
            'options' => 2,
        ],
        
        // Дополнительное соединение с Redis для кеширования
        'redis' => [
            'className' => \Bitrix\Main\Data\RedisConnection::class, // Используем расширение Redis
            'host' => 'redis', // Хост Redis сервера
            'port' => 12345, // Порт для подключения к Redis
        ],
    ],
    'readonly' => true,
],
```

Чтобы получить конкретное подключение в коде, укажите его название в методе `Application::getConnection`.

```php
// Получить подключение по умолчанию default
$db = \Bitrix\Main\Application::getConnection();

// Получить конкретное подключение
$db = \Bitrix\Main\Application::getConnection('default');
$redis = \Bitrix\Main\Application::getConnection('redis');
```

## Подключить key-value хранилище {#key-value}

### Memcache

Класс подключения — `\Bitrix\Main\Data\MemcacheConnection`.

```php
'memcache' => [
    'className' => \Bitrix\Main\Data\MemcacheConnection::class,
    'host' => '127.0.0.1',
    'port' => 11211,
    'persistent' => true,
    'connectionTimeout' => 1,
],
```

-  `host` — хост сервера. По умолчанию имеет значение `localhost`.

-  `port` — порт сервера. По умолчанию имеет значение `11211`.

-  `connectionTimeout` — таймаут подключения в секундах.

-  `persistent` — использовать постоянное соединение `pconnect`. По умолчанию `true`.

Чтобы подключить кластер, вместо `host` и `port` укажите параметр `servers` — массив серверов. Каждый элемент может содержать параметры `host`, `port`  и `weight`. По умолчанию  `weight` имеет значение `1`.

```php
'memcache.cluster' => [
    'className' => \Bitrix\Main\Data\MemcacheConnection::class,
    'servers' => [
        ['host' => '10.0.0.10', 'port' => 11211, 'weight' => 2],
        ['host' => '10.0.0.11', 'port' => 11211, 'weight' => 1],
    ],
    'persistent' => true,
    'connectionTimeout' => 1,
],
```

### Memcached

Класс подключения — `\Bitrix\Main\Data\MemcachedConnection`.

-  `host` — хост сервера. По умолчанию имеет значение `localhost`.

-  `port` — порт сервера. По умолчанию имеет значение `11211`.

-  `persistent` — использовать постоянный идентификатор `bx_cache`. По умолчанию `true`.

-  `connectionTimeout` — таймаут подключения в миллисекундах. По умолчанию `1000`.

-  `serializer` — сериализатор `Memcached::OPT_SERIALIZER`. Например, `\Memcached::SERIALIZER_PHP`.

```php
'memcached' => [
    'className' => \Bitrix\Main\Data\MemcachedConnection::class,
    'host' => '127.0.0.1',
    'port' => 11211,
    'persistent' => true,
    'connectionTimeout' => 1000,
    'serializer' => \Memcached::SERIALIZER_PHP,
],
```

Чтобы подключить кластер, вместо `host` и `port` укажите параметр `servers` — массив серверов. Каждый элемент может содержать параметры `host`, `port`  и `weight`. По умолчанию  `weight` имеет значение `1`.

```php
'memcached.cluster' => [
    'className' => \Bitrix\Main\Data\MemcachedConnection::class,
    'servers' => [
        ['host' => '10.0.0.20', 'port' => 11211, 'weight' => 1],
        ['host' => '10.0.0.21', 'port' => 11211, 'weight' => 1],
    ],
    'persistent' => true,
    'connectionTimeout' => 1000,
    'serializer' => \Memcached::SERIALIZER_PHP,
],
```

### Redis

Класс подключения — `\Bitrix\Main\Data\RedisConnection`.

-  `host` — хост сервера. По умолчанию имеет значение `localhost`.

-  `port` — порт сервера. По умолчанию имеет значение `6379`.

-  `password` — пароль для аутентификации. Доступен с версии main 25.800.0.

-  `persistent` — использовать постоянное соединение `pconnect` для одиночного сервера или  подключение `persistent` в кластере.

-  `timeout` — таймаут подключения в секундах.

-  `readTimeout` — таймаут чтения в секундах.

-  `serializer` — сериализатор, опция `Redis::OPT_SERIALIZER`. Значение задается константой класса `Redis`. По умолчанию `SERIALIZER_PHP` или `SERIALIZER_IGBINARY`, если доступен.

-  `compression` — тип компрессии, опция `Redis::OPT_COMPRESSION`. Значение задается константой класса `Redis`, например, `COMPRESSION_LZ4`, `COMPRESSION_ZSTD`.

-  `compression_level` — уровень компрессии, опция `Redis::OPT_COMPRESSION_LEVEL`. Целое число, для разных типов компрессии определены свои константы.

-  `failover` — политика failover для кластера, опция `RedisCluster::OPT_SLAVE_FAILOVER`. Применяется, если указано несколько серверов. Значение задается константой класса `RedisCluster`.

```php
'redis' => [
    'className' => \Bitrix\Main\Data\RedisConnection::class,
    'host' => '127.0.0.1',
    'port' => 6379,
    'password' => 'secret',
    'persistent' => true,
    'timeout' => 1.5,
    'readTimeout' => 1.0,
    'serializer' => \Redis::SERIALIZER_IGBINARY,
    'compression' => \Redis::COMPRESSION_LZ4,
    'compression_level' => \Redis::COMPRESSION_ZSTD_MAX,
],
```

{% note info "" %}

Про варианты значений для параметров `serializer`, `persistent`, `failover`, `timeout`, `read_timeout` можно прочитать в официальной документации расширения `redis`.

{% endnote %}

Чтобы подключить кластер, вместо `host` и `port` укажите параметр `servers` — массив серверов. Каждый элемент может содержать параметры `host` и `port`.

```php
'redis.cluster' => [
    'className' => \Bitrix\Main\Data\RedisConnection::class,
    'servers' => [
        ['host' => '10.0.0.30', 'port' => 6379],
        ['host' => '10.0.0.31', 'port' => 6379],
        ['host' => '10.0.0.32', 'port' => 6379],
    ],
    'failover' => \RedisCluster::FAILOVER_DISTRIBUTE,
    'persistent' => true,
    'timeout' => 1.5,
    'readTimeout' => 1.0,
],
```

### HandlerSocket

HandlerSocket — это плагин для MySQL, который работает без SQL-запросов. Он снижает нагрузку на сервер и ускоряет обработку данных.

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
    'port' => 9998,        // Порт для чтения, обычно 9998
],
```

О том, как HandlerSocket ускоряет работу с БД, читайте в статье [HandlerSocket](./handlersocket.md).