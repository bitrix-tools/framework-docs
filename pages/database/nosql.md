---
title: NoSQL
description: 'NoSQL. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

В рамках NoSQL-подхода Bitrix Framework поддерживает работу с key-value хранилищами:

-  Redis -- для кеширования, управления сессиями и обработки очередей задач,

-  Memcached -- только для кеширования данных.

## Настройка Redis

1. Установите расширение Redis для PHP.

2. Откройте файл `/bitrix/.settings.php`.

3. Добавьте новое подключение в секцию `connections`:

```php
'connections' => [
	'value' => [
		'default' => [
			'className' => \Bitrix\Main\DB\MysqliConnection::class,
			// настройки существующего подключения в БД
		],
		'custom.redis' => [
			'className' => \Bitrix\Main\Data\RedisConnection::class,
			'port' => 6379,
			'host' => '127.0.0.1',
			'serializer' => \Redis::SERIALIZER_IGBINARY,
		],
		'custom2.redis' => [
			'className' => \Bitrix\Main\Data\RedisConnection::class,
			'port' => 6379,
			'host' => '127.0.0.4',
			'serializer' => \Redis::SERIALIZER_IGBINARY,
		],
	],
	'readonly' => true,
]
```

Разные подключения Redis -- `custom.redis` и `custom2.redis` -- можно использовать для разных целей или распределения нагрузки.

### Особенности Redis cluster

Redis поддерживает два подхода к организации кластера.

-  **Мультимастерная конфигурация -- Multi-Master**. Несколько серверов Redis работают как равноправные мастер-узлы и могут принимать запись. Каждый мастер-узел может иметь собственные реплики -- слейвы.

-  **Традиционная конфигурация -- Master-Slave**. Все операции записи направляются на единственный мастер-узел. Слейвы будут копировать с него данные и обслуживать запросы на чтение.

### Как настроить Redis cluster в режиме Multi-Master

1. Укажите все мастер-узлы в массиве `servers`.

2. Задайте параметры кластера.

```php
// bitrix/.settings.php
return [
//...        
	'session' => [
		'value' => [
			'mode' => 'default',
			'handlers' => [
				'general' => [
					'type' => 'redis',   
					'servers' => [
						[
							'port' => 6379,
							'host' => '127.0.0.1',
						],
						[
							'port' => 6379,
							'host' => '127.0.0.2',
						],
						[
							'port' => 6379,
							'host' => '127.0.0.3',
						],
						'serializer' => \Redis::SERIALIZER_IGBINARY,
						'persistent' => false,
						'failover' => \RedisCluster::FAILOVER_DISTRIBUTE,
						'timeout' => null,
						'read_timeout' => null,
					],
				],           
			],
		]                   
	] 
];
```

-  `serializer`  -- определяет формат хранения данных,

-  `persistent` -- управляет типом соединения,

-  `failover` -- определяет поведение при сбое,

-  `timeout` -- задает время ожидания соединения в секундах,

-  `read_timeout` -- задает время ожидания ответа после соединения в секундах.

### Как настроить Redis cluster в режиме Master-Slave

1. Укажите основной сервер, который будет обрабатывать записи.

2. Redis обнаружит и задействует подключенные слейвы без дополнительных настроек.

```php
return [
	'session' => [
		'value' => [
			'mode' => 'default',
			'handlers' => [
				'general' => [
					'type' => 'redis',
					'servers' => [
						[
							'port' => '30015',
							'host' => '127.0.0.1'
						],
					],
				],
			],
		],
	],
];
```

### Как получить и использовать соединение с Redis

Bitrix Framework предоставляет два способа взаимодействия с Redis:

```php
/**
 * @var \Bitrix\Main\Data\RedisConnection $connection
 */
$connection = \Bitrix\Main\Application::getConnection('my-redis');
$connection->set('foo', 'bar');
$connection->get('foo');

/**
 * Можно получить объект подключения напрямую
 * 
 * @var \Redis
 */
$resource = $connection->getResource();
$resource->setnx('foo', 'bar');
```

Для большинства задач подходит `RedisConnection`-- этот способ безопаснее и интегрирован с фреймворком. Прямой доступ к методам Redis через `getResource()` нужен только для специфичных операций, недоступных через стандартный API.

## Настройка Memcached

1. Установите расширение Memcached для PHP.

2. Откройте файл `/bitrix/.settings.php`.

3. Добавьте новое подключение в секцию `connections`:

```php
'connections' => [
	'value' => [
		'default' => [
			'className' => \Bitrix\Main\DB\MysqliConnection::class,
			//... настройки существующего подключения в БД
		],
		'custom.memcached' => [
			'className' => \Bitrix\Main\Data\MemcachedConnection::class,
			'port' => 11211,
			'host' => '127.0.0.1',
		],
      'custom2.memcached' => [
        'className' => \Bitrix\Main\Data\MemcachedConnection::class,
        'port' => 6379,
        'host' => '127.0.0.4',
		],
	],
	'readonly' => true,
]
```

### Особенности Memcached cluster

Чтобы распределить нагрузку между несколькими серверами Memcached, укажите их в параметре `servers`. Чем больше `weight` сервера, тем больше запросов он будет получать. Для равномерного распределения задайте одинаковые значения для всех серверов:

```php
'connections' => [
	'value' => [
		'default' => [
			'className' => \Bitrix\Main\DB\MysqliConnection::class,
			//... настройки существующего подключения в БД
				],
		'custom.memcached' => [
			'className' => \Bitrix\Main\Data\MemcachedConnection::class,
			'servers' => [
				[
				'port' => 11211,
				'host' => '127.0.0.1',
				'weight' => 1,  
				],
				[
				'port' => 11211,
				'host' => '127.0.0.2',
				'weight' => 1, 
				],
			],
		],
	],
	'readonly' => true,
]
```

### Как получить и использовать соединение с Memcached

Bitrix Framework предлагает два подхода для работы с Memcached:

```php
/**
 * @var \Bitrix\Main\Data\MemcachedConnection $connection
 */
$connection = \Bitrix\Main\Application::getConnection('custom.memcached');
$connection->set('foo', 'bar');
$connection->get('foo');

/**
 * Можно получить объект подключения напрямую
 * 
 * @var \Memcached
 */
$resource = $connection->getResource();
$resource->flush();
```

Для обычного кеширования используйте `MemcachedConnection`. Прямой доступ через `getResource()` позволяет использовать нативные методы Memcached и выполнять специфичные операции -- такие как `flush()`.
