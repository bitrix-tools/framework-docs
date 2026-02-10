---
title: Логгеры
description: 'Логгеры. Продвинутые возможности Bitrix Framework: инструменты, сценарии и практические рекомендации.'
---

Bitrix Framework записывает события, ошибки и отладочную информацию с помощью логгеров. Система логирования следует общепринятому стандарту PSR-3.

Bitrix Framework предоставляет четыре логгера:

-  `\Bitrix\Main\Diag\Logger` — базовый класс для других логгеров,

-  `\Bitrix\Main\Diag\FileLogger` — записывает сообщения в файл,

-  `\Bitrix\Main\Diag\SysLogger` — отправляет сообщения в системный журнал,

-  `\Bitrix\Main\Diag\EventLogger` — записывает лог в таблицу  `b_event_log`.

Все логгеры используют форматтер `\Bitrix\Main\Diag\LogFormatter`, который выполняет замены плейсхолдеров по стандарту PSR-3.

## Как работает стандарт PSR-3

Интерфейс `\Psr\Log\LoggerInterface` определяет методы для записи сообщений на восьми уровнях важности. Уровни задаются константами `\Psr\Log\LogLevel::*` — от `emergency` до `debug`.

```php
interface LoggerInterface
{
    public function emergency($message, array $context = array());
    public function alert($message, array $context = array());
    public function critical($message, array $context = array());
    public function error($message, array $context = array());
    public function warning($message, array $context = array());
    public function notice($message, array $context = array());
    public function info($message, array $context = array());
    public function debug($message, array $context = array());
    public function log($level, $message, array $context = array());
}
```

Сообщение может содержать плейсхолдеры вида `{ключ}`. Их значения берутся из массива `$context`.

Если объект  принимает логгер, он реализует интерфейс `\Psr\Log\LoggerAwareInterface`.

```php
interface LoggerAwareInterface
{
    public function setLogger(LoggerInterface $logger);
}
```

## Логгеры Bitrix Framework

В Bitrix Framework логгеры расширяют PSR-3 и позволяют:

-  задавать минимальный уровень логирования,

-  назначать собственный форматтер.

### Файловый логгер

Файловый логгер `\Bitrix\Main\Diag\FileLogger` записывает сообщения в файл `$logFile`, например, `$_SERVER["DOCUMENT_ROOT"]."/log.txt"`. Если размер лога превышает `$maxLogSize`, логгер выполняет однократную ротацию файла. По умолчанию максимальный размер лога составляет 1 Мб. Чтобы отключить ротацию, укажите `$maxLogSize=0`.

```php
use Bitrix\Main\Diag\FileLogger;
use Psr\Log\LogLevel;

$logPath = $_SERVER['DOCUMENT_ROOT'] . '/log.txt';
$maxLogSize = 0;

$logger = new FileLogger($logPath, $maxLogSize);
$logger->setLevel(LogLevel::ERROR);

// запишет в лог
$logger->error($message, $context);
// не запишет в лог
$logger->debug($message, $context);
```

Пример кода создает файловый логгер, устанавливает уровень `ERROR` и записывает только сообщения этого уровня и выше.

### Syslog-логгер

`\Bitrix\Main\Diag\SysLogger` отправляет сообщения в системный журнал через PHP-функцию [syslog](https://www.php.net/manual/ru/function.syslog.php). Конструктор принимает параметры для функции [openlog](https://www.php.net/manual/ru/function.openlog.php).

```php
use Bitrix\Main\Diag\SysLogger;

$facility = LOG_USER;

$logger = new SysLogger('Bitrix WAF', LOG_ODELAY, $facility);
$logger->warning($message);
```

Пример кода отправляет предупреждение в системный журнал под именем `Bitrix WAF`.

### EventLogger

Логгер `\Bitrix\Main\Diag\EventLogger` — надстройка над `CEventLog`, записывает лог в таблицу  `b_event_log`.

В конструкторе логгера можно передать:

-  модуль,

-  тип события,

-  `callback`, который изменяет поля для записи в таблицу на основе `$context`.

```php
use Bitrix\Main\Diag\EventLogger;

$callback = function (array $context)
{
    return [
        'ITEM_ID' => $context['USER_ID'] ?? '',
    ];
};

$logger = new Diag\EventLogger('main', 'TEST', $callback);

$logger->error('Error creating user ID={USER_ID}.', ['USER_ID' => 100]);
```

### Где применяют логгеры

Функция `AddMessage2Log`, класс `\Bitrix\Main\Diag\FileExceptionHandlerLog`, модуль Проактивная защита используют файловый логгер.

В файле `/bitrix/.settings.php` можно:

-  задать логгер для `AddMessage2Log`,

-  переопределить логгер для модуля Конвертер файлов по идентификатору `transformer.Default`.

## Форматирование сообщений

Логгер может использовать собственный форматтер. По умолчанию — `\Bitrix\Main\Diag\LogFormatter`, который реализует интерфейс `\Bitrix\Main\Diag\LogFormatterInterface`.

```php
interface LogFormatterInterface
{
    public function format($message, array $context = []): string;
}
```

Форматтер преобразует сообщение и контекст в строку для записи.

Конструктор форматтера принимает параметры:

-  `$showArguments = false` — показывать ли аргументы в стеке вызовов,

-  `$argMaxChars = 30` — максимальная длина аргумента.

```php
use Bitrix\Main\Diag\FileLogger;
use Bitrix\Main\Diag\LogFormatter;

$logger = new FileLogger(LOG_FILENAME, 0);

$showArguments = true;
$formatter = new LogFormatter($showArguments);

$logger->setFormatter($formatter);
```

Пример кода создает логгер без ротации и подключает форматтер, который показывает аргументы функций в стеке вызовов.

Основная задача форматтера — подставлять значения из `$context` в плейсхолдеры сообщения. Форматтер обрабатывает плейсхолдеры:

-  `{date}` — текущее время,

-  `{host}` — HTTP-хост,

-  `{exception}` — объект исключения `\Throwable`,

-  `{trace}` — стек вызовов,

-  `{delimiter}` — разделитель сообщений.

Плейсхолдеры `{date}`, `{host}`, `{delimiter}` подставляются автоматически, в `$context` их не обязательно передавать.

```php
use Bitrix\Main\Diag\Helper;

$logger->debug(
    "{date} - {host}\n{trace}{delimiter}\n", 
    [
        'trace' => Diag\Helper::getBackTrace(6, DEBUG_BACKTRACE_IGNORE_ARGS, 3)
    ]
);
```

Пример кода записывает отладочное сообщение с датой, хостом и стеком вызовов. Вспомогательный метод `getBackTrace` возвращает значение `trace`.

Форматтер корректно обрабатывает строки, массивы и объекты.

### JSON Lines форматтер

Форматтер `\Bitrix\Main\Diag\JsonLinesFormatter` доступен с версии 25.300.0. Он игнорирует текст сообщения и выводит `$context` в формате JSON Lines — по одной записи на строку.

## Как подключить логгер

Логгер можно подключить к классу двумя способами:

-  передать его извне — подходит для новых классов,

-  получить через встроенную фабрику — когда нельзя изменять код проекта.

### Передать логгер объекту

1. Создайте класс, который реализует интерфейс `\Psr\Log\LoggerAwareInterface`. Можно использовать трейт `\Psr\Log\LoggerAwareTrait`, он автоматически предоставляет метод `setLogger()`.

2. Создайте экземпляр класса.

3. Создайте файловый логгер с помощью `\Bitrix\Main\Diag\FileLogger`.

4. Передайте логгер в объект через метод `setLogger`.

5. Вызовите метод, который использует логирование. Например, в примере `doSomething` записывает ошибку.

```php
use Bitrix\Main\Diag;
use Psr\Log;

class MyClass implements Log\LoggerAwareInterface
{
    use Log\LoggerAwareTrait;
    
    public function doSomething()
    {
        if ($this->logger)
        {
            $this->logger->error('Error!');
        }
    }
}

$object = new MyClass();
$logger = new Diag\FileLogger("/var/log/php/error.log");
$object->setLogger($logger);
$object->doSomething();
```

### Получить логгер через фабрику

Фабрика — это встроенный механизм Bitrix Framework, который создает логгер по текстовому идентификатору. Фабрика позволяет получать логгер внутри класса, а не передавать его вручную.

1. Создайте класс с интерфейсом `\Psr\Log\LoggerAwareInterface`. Можно использовать трейт `\Psr\Log\LoggerAwareTrait`.

2. Добавьте защищенный метод `getLogger()`, который инициализирует логгер по идентификатору, например, `myClassLogger`.

```php
use Bitrix\Main\Diag;
use Psr\Log;

class MyClass implements Log\LoggerAwareInterface
{
    use Log\LoggerAwareTrait;
    
    public function doSomething()
    {
        if ($logger = $this->getLogger())
        {
            $logger->error('Error!');
        }
    }

    protected function getLogger()
    {
        if ($this->logger === null)
        {
            $logger = Diag\Logger::create('myClassLogger', [$this]);
            $this->setLogger($logger);
        }
        return $this->logger;
    }
}
```

## Как внедрить логгер через DI

В класс логгер можно передать с помощью механизма внедрения зависимостей.

Например, есть класс-сервис `MyService`.

```php
namespace My\Testing;

use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

final class MyService
{
    public function __construct(
        private readonly LoggerInterface $logger = new NullLogger,
    )
    {}

    public function test()
    {
        $this->logger->info('My message');
    }
}
```

Если создать экземпляр класса без дополнительной конфигурации, система будет использовать `NullLogger`, и записи не попадут никуда.

Чтобы использовать конкретный логгер, в файле конфигурации модуля `/local/modules/[имя-модуля]/.settings.php` добавьте обработку создания класса:

```php
return [
    'services' => [
        'value' => [
            \My\Testing\MyService::class => [
                'constructor' => static function()
                {
                    $logger = new \Bitrix\Main\Diag\FileLogger(
                        '/var/log/php/my-testing.log',
                    );

                    return new \My\Testing\MyService(
                        $logger,
                    );
                },
            ],
        ],
        'readonly' => true,
    ],
];
```

Этот пример использует стандартный файловый логгер `\Bitrix\Main\Diag\FileLogger`. Чтобы подключить сторонний пакет, например `monolog`, в конфигурации модуля выполните аналогичные настройки.

```php
return [
    'services' => [
        'value' => [
            \My\Testing\MyService::class => [
                'constructor' => static function()
                {
                    $logger = new \Monolog\Logger('my-testing');
                    $logger->pushHandler(
                        new \Monolog\Handler\StreamHandler('/var/log/php/my-testing.log')
                    );

                    return new \My\Testing\MyService(
                        $logger,
                    );
                },
            ],
        ],
        'readonly' => true,
    ],
];
```

{% note info "" %}

Предварительно настройте [Composer](./../get-started/composer.md) и установите пакет через `composer require monolog/monolog`.

{% endnote %}

## Настройка в .settings.php

В файле `/bitrix/.settings.php` логгеры настраивают в секции `loggers`. Синтаксис похож на настройку `ServiceLocator`, но вместо реестра объектов в секции конфигурируют фабрику логгеров.

```php
return [
    'services' => [
        'value' => [
            'formatter.Arguments' => [
                'className' => '\Bitrix\Main\Diag\LogFormatter',
                'constructorParams' => [true],
            ],
        ],
        'readonly' => true,
    ],
    'loggers' => [
        'value' => [
            'main.HttpClient' => [
                'constructor' => function (\Bitrix\Main\Web\HttpClient $http, $method, $url)
                { 
                    $http->setDebugLevel(\Bitrix\Main\Web\HttpDebug::ALL);
                    return new \Bitrix\Main\Diag\FileLogger('/home/bitrix/www/log.txt');
                },
                'level' => \Psr\Log\LogLevel::DEBUG,
                'formatter' => 'formatter.Arguments',
            ],
        ],
        'readonly' => true,
    ],
];
```

Каждый логгер может содержать:

-  `constructor` — функцию, которая создает экземпляр логгера,

-  `level` — минимальный уровень логирования,

-  `formatter` — идентификатор форматтера из секции `services`.

В замыкание `constructor` передают дополнительные параметры через второй аргумент вызова фабрики. Они позволяют адаптировать логирование под конкретный объект. Например, включить отладку или передать URL запроса.

```php
\Bitrix\Main\Diag\Logger::create('logger.id', [$this]);
```

Если в настройках используется замыкание `constructor`, его размещают в файле `.settings_extra.php`. Этот файл не перезаписывается при сохранении настроек через административную панель или API.

{% note warning "" %}

Секция `loggers` управляет только PSR-3-совместимыми логгерами. Логирование необработанных исключений и фатальных ошибок настраивается в секции `exception_handling`. Подробно про параметр логирования `log` читайте в статье [Конфигурация ядра](./../framework/settings.md).

{% endnote %}

## Логирование HTTP-клиента

Класс `\Bitrix\Main\Web\HttpClient` поддерживает PSR-3 логгеры и позволяет настраивать их через секцию `loggers` в `/bitrix/.settings.php`. При обработке асинхронных запросов можно создавать отдельный логгер для каждого запроса. Например, записывать отладку в разные файлы и избегать смешивания логов.

Фабрика передает в замыкание-конструктор два объекта:

-  `\Bitrix\Main\Web\Http\DebugInterface $debug` — управляет уровнем отладки через константы `\Bitrix\Main\Web\HttpDebug`,

-  `\Psr\Http\Message\RequestInterface $request` — текущий HTTP-запрос.

```php
return [
    // ...
    'loggers' => [
        'value' => [
            'main.HttpClient' => [
                'constructor' => function (\Bitrix\Main\Web\Http\DebugInterface $debug, \Psr\Http\Message\RequestInterface $request)
                { 
                    // Включаем полную отладку HTTP-клиента                    
                    $debug->setDebugLevel(\Bitrix\Main\Web\HttpDebug::ALL);
                    // Генерируем уникальное имя файла на основе хеша объекта запроса
                    // Создаем отдельный файловый логгер для текущего запроса
                    return new \Bitrix\Main\Diag\FileLogger('/home/bitrix/www/httplog'. spl_object_hash($request) . '.txt');
                },
                // Записываем все сообщения уровня DEBUG и выше
                'level' => \Psr\Log\LogLevel::DEBUG,
            ],
        ],
    ],
    // ...
];
```

В конфигурации можно назначить кастомный форматтер, чтобы логировать все обращения к внешним ресурсам через HTTP-клиент.

```php
return [
    // ...
    'loggers' => [
        'value' => [
            'main.HttpClient' => [
                'constructor' => function (\Bitrix\Main\Web\Http\DebugInterface $debug, \Psr\Http\Message\RequestInterface $request)
                {
                    // Включаем только логирование заголовков запроса                    
                    $debug->setDebugLevel(\Bitrix\Main\Web\HttpDebug::REQUEST_HEADERS);
    
                    // Единый файл для всех внешних вызовов
                    $logger = new \Bitrix\Main\Diag\FileLogger($_SERVER['DOCUMENT_ROOT'] . '/http.txt');
    
                    // Назначаем анонимный форматтер
                    $logger->setFormatter(
                        new class($request) implements \Bitrix\Main\Diag\LogFormatterInterface 
                        {
                            public function __construct(public \Psr\Http\Message\RequestInterface $request) {}
    
                            public function format($message, array $context = []): string
                            {
                                // Игнорируем запросы к push-серверу
                                if ($this->request->getUri()->getPort() === 1337)
                                {
                                    return '';
                                }
    
                                return $this->request->getUri() . " \t" . $_SERVER['REQUEST_URI'] . "\n";
                            }
                        }
                    );
    
                    return $logger;
                },
                'level' => \Psr\Log\LogLevel::DEBUG,
            ],
        ],
        'readonly' => true,
    ],
    // ...
];
```

## Когда использовать NullLogger

Вместо проверки `if ($logger)` можно использовать `\Psr\Log\NullLogger`. Он принимает сообщения, но ничего не записывает.

{% note info "" %}

Сообщение и контекст формируются, даже если лог не пишется.

{% endnote %}

## Классы с поддержкой фабрики логгеров

-  Класс `\Bitrix\Main\Web\HttpClient`:

   -  идентификатор логгера — `main.HttpClient`,

   -  параметры — `[$this, $this->queryMethod, $this->effectiveUrl]`.

-  Класс `\Bitrix\Main\Service\GeoIp\Manager`:

   -  идентификатор логгера — `main.GeoIpManager`,

   -  параметров нет.

-  Функция `AddMessage2Log`:

   -  идентификатор логгера — `main.Default`,

   -  параметры — `LOG_FILENAME`, `$showArgs`.