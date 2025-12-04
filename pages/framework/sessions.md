---
title: Сессии
description: 'Сессии. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Сессии в Bitrix Framework позволяют сохранять данные между запросами пользователя. Это важно для управления состоянием пользователя и персонализации его опыта на сайте.

## Работа с сессиями

Прямое обращение к `$_SESSION` может привести к ошибкам и усложнить поддержку кода. При работе с сессиями используйте объект, возвращаемый методом `\Bitrix\Main\Application::getSession()`. Это обеспечит безопасный и управляемый доступ к данным сессии.

```php
$session = \Bitrix\Main\Application::getInstance()->getSession();
if (!$session->has('foo'))
{
	$session->set('foo', 'bar');            
}
echo $session['foo']; //bar
```

Этот объект поддерживает интерфейсы `\ArrayAccess` и [\\Bitrix\\Main\\Session\\SessionInterface](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Session-SessionInterface.html).

## Сессионный кеш

Кешируйте данные пользователя, когда это необходимо. Использовать сессию для кеширования не рекомендуется, так как это может замедлить работу и вызвать блокировки. С версии main 20.5.400 доступен альтернативный вариант -- создать кеш, привязанный к `session_id()`.

```php
$localStorage = \Bitrix\Main\Application::getInstance()->getLocalSession('someCategory');
if (!isset($localStorage['productIds'])) {
    $localStorage->set('productIds', [1, 2, 100]);
    $localStorage->set('price', 42);
}

var_dump($localStorage->get('productIds'));
```

При вызове `\Bitrix\Main\Application::getLocalSession($name)` возвращается экземпляр [\\Bitrix\\Main\\Data\\LocalStorage\\SessionLocalStorage](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Data-LocalStorage-SessionLocalStorage.html). Это элемент кеша, который использует `session_id()` для изоляции данных. Использование этого метода рекомендуется в случаях, когда необходимо временно хранить данные, специфичные для текущей сессии пользователя, такие как корзина покупок или временные настройки.

Если это первое обращение и данных нет, создается пустой контейнер. Если в кеше есть данные по `$name`, контейнер наполняется ими.

Ядро автоматически сохраняет все `SessionLocalStorage` в конце хита.

{% note info "" %}

`SessionLocalStorage` работает на кеше, описанном в настройках файла `.settings.php`. Описание конфигурации смотрите [ниже](./sessions#конфигурация-хранения-данных)[.](#settings)

{% endnote %}

Если кеш файловый, `SessionLocalStorage` использует для хранения `$_SESSION` . Это помогает избежать проблем с контролем и удалением устаревших файлов.

## Виды сессии

Для ускорения производительности существует несколько видов сессий, которые можно использовать в зависимости от потребностей вашего проекта.

### Неблокирующие сессии

В проектах с множественными AJAX-запросами часто возникают блокировки хитов одного пользователя из-за ожидания блокировки сессии. Чтобы включить неблокирующую сессию, установите константу [до подключения ядра продукта](./request-lifecycle).

```php
define('BX_SECURITY_SESSION_READONLY', true);
```

После этого сессия читается из memcached или базы данных без ожидания блокировки. Внутри продукта эта функциональность используется, например, при отдаче файлов.

{% note info "" %}

При использовании этой константы сессия не будет записана по завершении хита. Это может привести к потере данных, сохраненных в рамках хита в сессии.

{% endnote %}

### Виртуальные сессии

Если сессия не нужна, используйте виртуальные сессии. Они создаются в памяти и не сохраняются. Чтобы включить виртуальную сессию, установите константу до подключения ядра продукта.

```php
define('BX_SECURITY_SESSION_VIRTUAL', true);
```

{% note info "" %}

Этот тип сессии не сохраняется. Он используется при обработке REST-запросов в продукте.

{% endnote %}

## Конфигурация хранения данных

Ядро поддерживает четыре варианта хранения данных сессии: файлы, Redis, база данных и Memcache.

Способ хранения указывается в файле `/bitrix/.settings.php` в секции `session`. По умолчанию секция `session` может отсутствовать в файле `.settings.php`, и тогда по умолчанию используется файловый метод хранения сессий. Чтобы изменить способ хранения, добавьте секцию `session` вручную.

При выборе способа хранения данных сессии учитывайте масштаб проекта и нагрузку на сервер. Например, для небольших проектов может быть достаточно хранения в файлах. Однако для крупных систем с высокой нагрузкой стоит рассмотреть использование Redis или Memcache, чтобы повысить скорость доступа к данным и обеспечить более эффективное управление ресурсами.

### Хранение в файлах

```php
// bitrix/.settings.php
return [
    //...
    'session' => [
        'value' => [
            'mode' => 'default',
            'handlers' => [
                'general' => [
                    'type' => 'file',
                ]
            ],
        ]
    ]
];
```

### Использование Redis

```php
// bitrix/.settings.php
return [
    'session' => [
        'value' => [
            'mode' => 'default',
            'handlers' => [
                'general' => [
                    'type' => 'redis',
                    'port' => '6379',
                    'host' => '127.0.0.1',
                ],
            ],
        ],
    ]
];
```

Чтобы настроить Redis в режиме cluster,  добавьте `servers` одним из двух способов.

1. Мультимастер кластер: N мастеров, у каждого могут быть слейвы.

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
                       ],
                       'serializer' => \Redis::SERIALIZER_IGBINARY,
                       'persistent' => false,
                       'failover' => \RedisCluster::FAILOVER_DISTRIBUTE,
                       'timeout' => null,
                       'read_timeout' => null,
                   ],
               ],
           ]
       ]
   ];
   ```

2. Обычный кластер: 1 мастер и N слейвов.

   ```php
   // bitrix/.settings.php
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

### Использование Memcache

```php
// bitrix/.settings.php
return [
    //...
    'session' => [
        'value' => [
            'mode' => 'default',
            'handlers' => [
                'general' => [
                    'type' => 'memcache',
                    'port' => '11211',
                    'host' => '127.0.0.1',
                ],
            ],
        ]
    ]
];
```

Если необходимо создать кластер из memcache серверов, добавьте настройку `servers`.

```php
// bitrix/.settings.php
return [
    //...
    'session' => [
        'value' => [
            'mode' => 'default',
            'handlers' => [
                'general' => [
                    'type' => 'memcache',
                    'servers' => [
                        [
                            'port' => 11211,
                            'host' => '127.0.0.1',
                            'weight' => 1,
                        ],
                        [
                            'port' => 11211,
                            'host' => '127.0.0.2',
                        ],
                    ],
                ],
            ],
        ]
    ]
];
```

### Хранение в базе данных MySQL

Данные хранятся в таблице `b_user_session`.

```php
// bitrix/.settings.php
return [
    //...
    'session' => [
        'value' => [
            'mode' => 'default',
            'handlers' => [
                'general' => [
                    'type' => 'database',
                ],
            ],
        ]
    ]
];
```

## Дополнительные настройки

Существуют дополнительные настройки сессии, которые можно описать в `.settings.php`.

```php
// bitrix/.settings.php
return [
//...        
    'session' => [
        'value' => [
            'lifetime' => (int),
            'mode' => 'default',  // или 'separated' для разделенного режима
            'regenerateIdAfterLogin' => (bool),
            'ignoreSessionStartErrors' => (bool),
            'handlers' => [
                //...       
            ],
        ]                   
    ] 
];
```

-  `lifetime` -- задает время жизни сессии в секундах.

-  `mode` -- режим работы сессий: `default` -- стандартный, `separated` -- [разделенный](./sessions#разделенный-режим-сессии).

-  `regenerateIdAfterLogin` -- отвечает за перегенерацию `session_id()` после успешного входа пользователя. По умолчанию `false`.

-  `ignoreSessionStartErrors` -- если установлено `true`, фатальные ошибки при старте сессии будут игнорироваться. Например, ошибка подключения к серверу хранения сессий. При этом хит продолжит работать без сессии, а ошибки будут записываться только в лог. По умолчанию `false`.

## Разделенный режим сессии

Чтобы включить разделенный режим сессии, внесите правки в конфигурационный файл `/bitrix/.settings.php`.

1. Измените `session[mode]` на `separated`, чтобы включить разделенный режим сессии.

2. Задайте время жизни сессии `lifetime` в секундах, например, `'lifetime' => 14400` -- 4 часа.

3. Добавьте `'kernel' => 'encrypted_cookies'` в `handlers`, чтобы hot-данные хранились в зашифрованных cookies.

```php
return [
    //...
    'session' => [
        'value' => [
            'mode' => 'separated',
            'lifetime' = 1440, 
            'handlers' => [
                'kernel' => 'encrypted_cookies',
                'general' => [
                    'type' => 'file',
                ]
            ],
        ]
    ]
];
```

{% note tip "" %}

Подробнее в статье [Сессия в разделенном режиме](./../performance/hot-and-cold-session).

{% endnote %}
