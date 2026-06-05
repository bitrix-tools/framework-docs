---
title: HTTP-клиент
description: 'HTTP-клиент. Продвинутые возможности Bitrix Framework: инструменты, сценарии и практические рекомендации.'
---

В ядре Bitrix Framework есть встроенный HTTP-клиент, который отправляет запросы к внешним сервисам. Это класс `\Bitrix\Main\Web\HttpClient`. Он поддерживает два режима работы: упрощенный legacy и стандартный PSR-18.

Используйте legacy-режим, чтобы получить данные с сайта, отправить форму или скачать файл.

Используйте PSR-18, если нужен полный контроль над запросом, совместимость со сторонними библиотеками или доступ к расширенным возможностям клиента, например, асинхронным вызовам.

## Задать параметры HTTP-клиента по умолчанию

Задайте значения по умолчанию в файле `/bitrix/.settings.php`, чтобы не передавать параметры при каждом создании клиента.

Клиент `HttpClient` принимает следующие параметры: таймауты, настройки прокси, обработку редиректов и другие. Эти настройки работают для всех запросов через `HttpClient`. Они применяются к legacy-методам и к PSR-18.

В файл `.settings.php` можно передать те же параметры, что и в конструктор класса `HttpClient`.

{% note info "" %}

Параметры, которые работают только в legacy-режиме, отмечены `*`.

{% endnote %}

-  `redirect*` — следовать редиректам. По умолчанию `true`.

-  `redirectMax*` — максимальное число редиректов. По умолчанию `5`.

-  `waitResponse` — ожидать ответ или отключаться сразу после чтения заголовков. По умолчанию `true`.

-  `socketTimeout` — таймаут установки соединения в секундах. По умолчанию `30`.

-  `streamTimeout` — таймаут ожидания данных от сервера. Значения по умолчанию:

   -  `60` — если `waitResponse` установлен в `true`,

   -  `1` — когда `waitResponse` установлен в `false`.

-  `compress` — принимать сжатый gzip-ответ. По умолчанию `false`.

-  `version*` — версия HTTP-протокола. Допустимые значения `1.0` или `1.1`. По умолчанию `1.1`.

-  `charset` — кодировка для тела POST- и PUT-запросов.

-  `useCurl` — использовать библиотеку cURL вместо сокетов.

-  `curlLogFile` — полный путь к файлу лога cURL.

-  `proxyHost`, `proxyPort`, `proxyUser`, `proxyPassword` — параметры прокси.

-  `disableSslVerification` — отключить проверку SSL-сертификата.

-  `privateIp` — разрешить запросы к частным IP-адресам. По умолчанию `true`.

-  `bodyLengthMax` — ограничить максимальный размер тела ответа. По умолчанию `0` — без ограничений.

-  `debugLevel` — уровень детализации отладки. Используйте константы `HttpDebug::*`.

-  `headers*`, `cookies*` — заголовки и cookies по умолчанию.

Пример настройки:

```php
return [
    // ...
    "http_client_options" => [
        "value" => [
            "redirect" => true,
            "redirectMax" => 10,
            "version" => "1.1",
            "socketTimeout" => 20,
            "streamTimeout" => 20,
            "useCurl" => true,
        ],
        "readonly" => false,
    ]
    // ...
];
```

Проверить текущие настройки можно с помощью метода `Configuration::getValue()`.

```php
use Bitrix\Main\Config\Configuration;
print_r(Configuration::getValue('http_client_options'));
```

## Legacy-режим

Legacy-режим использует готовые методы: `get()`, `post()`, `download()` и другие. Эти методы упрощают работу с HTTP — не нужно вручную собирать запрос и обрабатывать потоки. Достаточно вызвать один метод с нужными параметрами.

Клиент автоматически добавляет недостающие заголовки: `Host`, `Connection: close`, `Accept: */*`, `Accept-Language: en` и другие. Явно указывать их необязательно.

### Выполнить GET-запрос

Передайте URL в метод `get()`. Метод вернет тело ответа или `false` при ошибке. После вызова получите статус, заголовки или ошибку.

```php
use Bitrix\Main\Web\HttpClient;

$http = new HttpClient([
    'compress' => true,
    'headers' => [
        'User-Agent' => 'bitrix',
    ],
]);

$result = $http->get('https://1c-bitrix.ru/');

if ($result !== false)
{
    var_dump($http->getStatus());
    var_dump($http->getHeaders());
}
else
{
    var_dump($http->getError());
}
```

Клиент автоматически выполняет редирект и распаковывает тело ответа при включенной опции `compress`.

### Скачать файл

Передайте URL файла и абсолютный путь к месту сохранения. По умолчанию используется метод GET.

```php
use Bitrix\Main\Web\HttpClient;

$httpClient = new HttpClient();
$httpClient->download(
    'http://www.example.ru/robots.txt',
    $_SERVER['DOCUMENT_ROOT'].'/upload/my.txt'
);
```

Метод `download()` поддерживает другие HTTP-методы и отправку данных. Например, можно скачать файл по POST-запросу с параметрами.

### Отправить данные формы

Данные формы передайте в виде ассоциативного массива вторым аргументом в метод `post()`. Клиент преобразует массив в строку формата `ключ1=значение1&ключ2=значение2` и установит заголовок `Content-Type: application/x-www-form-urlencoded`.

```php
use Bitrix\Main\Web\HttpClient;

$httpClient = new HttpClient();
$response = $httpClient->post('http://www.example.ru/form', ['x' => 1, 'y' => 2]);
```

{% note info "" %}

Заголовки можно задать вручную с помощью метода `setHeader()`.

{% endnote %}

### Отправить JSON-данные методом POST

Для отправки JSON укажите заголовок `Content-Type: application/json` и передайте тело как JSON-строку.

```php
use Bitrix\Main\Web\HttpClient;

$httpClient = new HttpClient();
$httpClient->setHeader('Content-Type', 'application/json');
$response = $httpClient->post(
    'http://www.example.ru',
    json_encode(['x' => 1])
);
```

### Выполнить запрос с авторизацией по cookies

Сначала выполните запрос, чтобы получить cookies. Затем передайте их в следующий запрос. Это полезно при работе с сайтами, требующими сессию.

```php
use Bitrix\Main\Web\HttpClient;

$url = "http://www.example.ru";
$url2 = "http://www.example.ru/form_request";
$post = "val1=true&val2=false";

$httpClient = new HttpClient(); 
$httpClient->query('GET', $url);
$cookie = $httpClient->getCookies()->toArray();

$httpClient->setHeader('Content-Type', 'application/x-www-form-urlencoded'); 
$httpClient->setCookies($cookie);
$response = $httpClient->post($url2, $post);
```

### Условное чтение тела ответа

С версии 23.300.0 главного модуля можно динамически управлять чтением тела ответа вместо использования параметра `waitResponse`.

1. Укажите callback-функцию в методе `shouldFetchBody()`. Функция получит объект ответа с заголовками и исходный запрос.

2. Верните `true`, чтобы прочитать тело, или `false` — чтобы прервать соединение после получения заголовков.

```php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Http\Response;
use Psr\Http\Message\RequestInterface; 

$http = new HttpClient();

$http->shouldFetchBody(function (Response $response) {
    return ($response->getHeadersCollection()->getContentType() === 'text/html');
});

$result = $http->get('https://www.1c-bitrix.ru/');
var_dump($result);
```

## Стандарт PSR-18

PSR-18 — это стандарт PHP-FIG для HTTP-клиентов. Он определяет единый способ отправки запросов и обработки ответов.

Интерфейс `\Psr\Http\Client\ClientInterface` содержит один метод для отправки HTTP-запроса:

```php
interface ClientInterface
{
    public function sendRequest(RequestInterface $request): ResponseInterface;
}
```

Чтобы отправить запрос, создайте объект запроса `RequestInterface` и передайте его в метод `sendRequest()`. Клиент вернет объект ответа `ResponseInterface`.

В ядре Bitrix Framework реализованы все необходимые компоненты стандарта PSR-7 и PSR-18:

-  `\Bitrix\Main\Web\Uri` — унифицированный идентификатор ресурса,

-  `\Bitrix\Main\Web\Http\Request` — запрос,

-  `\Bitrix\Main\Web\Http\Response` — ответ,

-  `\Bitrix\Main\Web\Http\Stream` — тело запроса или ответа,

-  `\Bitrix\Main\Web\Http\ClientException` — общее исключение клиента,

-  `\Bitrix\Main\Web\Http\RequestException` — ошибка при обработке запроса,

-  `\Bitrix\Main\Web\Http\NetworkException` — сетевая ошибка, например, таймаут или недоступность хоста.

Эти классы можно использовать для построения запросов любой сложности.

### Отправить POST-запрос с данными формы

1. Создайте объект URI с полным URI конечной точки: протокол, хост и путь к скрипту.

2. Подготовьте данные формы в виде ассоциативного массива.

3. Преобразуйте массив в строку и запишите ее в поток `Stream`.

4. Соберите объект запроса `Request` с методом `POST`, URI, заголовками и телом.

5. Передайте запрос в метод `sendRequest()`.

6. Обработайте ответ или исключение при ошибке.

```php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Uri;
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\Http\Method;
use Bitrix\Main\Web\Http\Stream;
use Bitrix\Main\Web\Http\ClientException;

$http = new HttpClient([
    'compress' => true,
]);

$data = [
    'k1' => 'v1',
    'k2' => 'v2',
];

$uri = new Uri('http://demo.local/test.php');

$body = new Stream('php://temp', 'r+');
$body->write(http_build_query($data, '', '&'));

$request = new Request(Method::POST, $uri, [], $body);

try
{
    $response = $http->sendRequest($request);
    
    var_dump($response->getStatusCode());
    var_dump($response->getHeaders());
    var_dump((string)$response->getBody());
}
catch (ClientException $e)
{
    var_dump($e->getMessage());
}
```

### Отправить файл методом POST

Чтобы отправить файл на сервер, выполните четыре действия.

1. Откройте файл как ресурс с помощью `fopen()`.

2. Передайте файл в теле запроса. Клиент автоматически оформит запрос в формате `multipart/form-data`. HTML-формы используют этот формат при загрузке файлов.

3. Укажите имя файла. Дополнительно можно задать MIME-тип.

4. Закройте файловый дескриптор после создания потока. Это освобождает системные ресурсы.

```php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Uri;
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\Http\Method;
use Bitrix\Main\Web\Http\MultipartStream;
use Bitrix\Main\Web\Http\ClientException;

$http = new HttpClient([
    'compress' => true,
]);

// Открываем файл для чтения
$res = fopen('/home/bitrix/www/photo.jpg', 'r');

$data = [
    'k1' => 'v1',
    'k2' => 'v2',
    'k3' => [
        'resource' => $res,        // ссылка на открытый файл
        'filename' => 'pic.jpg',   // имя файла, которое увидит сервер
    ],
];

$uri = new Uri('http://demo.local/test.php');

// MultipartStream автоматически сформирует тело запроса
$body = new MultipartStream($data);

// Указываем Content-Type с boundary, который сгенерировал MultipartStream
$headers = [
    'User-Agent' => 'bitrix',
    'Content-type' => 'multipart/form-data; boundary=' . $body->getBoundary(),
];

$request = new Request(Method::POST, $uri, $headers, $body);

// Закрываем файл после использования
fclose($res);

try
{
    $response = $http->sendRequest($request);
    
    var_dump($response->getStatusCode());
    var_dump($response->getHeaders());
    var_dump((string)$response->getBody());
}
catch (ClientException $e)
{
    var_dump($e->getMessage());
}
```

### Обработать редиректы вручную

Когда сервер отвечает кодом `301` или `302`, он указывает новый адрес в заголовке `Location`.

В режиме PSR-18 клиент не переходит по новому адресу. Он возвращает исходный ответ от сервера с кодом и заголовком `Location`.

Чтобы перейти по новому адресу, проверьте наличие заголовка `Location` и отправьте новый запрос с обновленным URI. Повторяйте этот шаг, пока сервер не вернет окончательный ответ.

Клиент автоматически преобразует кириллические домены в Punycode.

```php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Uri;
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\Http\Method;
use Bitrix\Main\Web\Http\ClientException;

$http = new HttpClient([
    'compress' => true,
    'disableSslVerification' => true,
]);

$uri = new Uri('http://1с-битрикс.рф/');
$request = new Request(Method::GET, $uri);

try
{
    do
    {    
        $response = $http->sendRequest($request);
        
        if ($response->hasHeader('Location'))
        {
            $location = $response->getHeader('Location')[0];
            $request = $request->withUri(new Uri($location));
        }
    }
    while ($response->hasHeader('Location'));
}
catch (ClientException $e)
{
    var_dump($e->getMessage());
}
```

## Асинхронные запросы

Обычные HTTP-запросы выполняются синхронно и последовательно: клиент отправляет первый запрос, ждет ответ, затем отправляет следующий и так далее. Общее время складывается из всех задержек.

Асинхронные запросы отправляются и после этого не блокируют поток выполнения ожиданием ответа. Клиент не ждет ответ от первого сервера, а сразу отправляет следующий запрос. Это сокращает общее время выполнения, особенно при работе с медленными внешними сервисами.

Для асинхронных запросов используйте метод `sendAsyncRequest()`. Он добавляет запрос в очередь и возвращает объект `Promise` — контейнер для отложенного результата.

Объект `Promise` — это внутренний инструмент Bitrix Framework. Он не связан со стандартами PSR и существует только в контексте `HttpClient`. Объект поддерживает стандартный интерфейс `\Http\Promise\Promise`.

### Получить ответы без контроля порядка

Добавьте все запросы в очередь с помощью `sendAsyncRequest()`. Затем вызовите метод `wait()`. Он выполнит все запросы из очереди и вернет ответы в порядке их получения — самый быстрый ответ окажется первым.

Этот способ подходит, если порядок ответов не важен.

```php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Uri;
use Bitrix\Main\Web\Http\Request;
use Bitrix\Main\Web\Http\Method;
use Bitrix\Main\Web\Http\ClientException;

$http = new HttpClient();

$urls = [
    'http://www.example.ru/images/t/top1.jpg',
    'http://1с-битрикс.рф',
    'https://www.1c-bitrix.ru/',
];

foreach ($urls as $url)
{
    $request = new Request(Method::GET, new Uri($url));
    $http->sendAsyncRequest($request);
}

try
{
    foreach ($http->wait() as $response)
    {
        var_dump($response->getStatusCode());
    }
}
catch (ClientException $e)
{
    var_dump($e->getMessage());
}
```

### Сохранить порядок запросов с помощью объектов Promise

Чтобы сохранить соответствие между исходным списком URL и результатами, сохраните объекты `Promise` в массив и обработайте их по порядку.

Каждый вызов `wait()` на объекте `Promise` возвращает ответ того запроса, который создал этот `Promise`. В результате первый URL в списке всегда соответствует первому результату.

```php
$promises = [];

foreach ($urls as $url)
{
    $request = new Request(Method::GET, new Uri($url));
    $promises[] = $http->sendAsyncRequest($request);
}

foreach ($promises as $promise)
{
    try
    {
        $response = $promise->wait();
        var_dump($promise->getRequest()->getUri()->getHost());
        var_dump($response->getStatusCode());
    }
    catch (ClientException $e)
    {
        var_dump($e->getMessage());
    }
}
```

### Отреагировать на результаты через callback-функции

Назначьте callback-функцию, чтобы обработать ответ сразу после его получения. Для этого используйте метод `then()` объекта `Promise`.

Первая callback-функция получает успешный ответ. Вторая callback-функция обрабатывает ошибку. Эту функцию можно не указывать, если обработка ошибок не требуется.

Callback-функции позволяют строить цепочки обработки без блокирующих вызовов `wait()`.

```php
foreach ($urls as $url)
{
    $request = new Request(Method::GET, new Uri($url));
    $promise = $http->sendAsyncRequest($request);

    $promise->then(function ($response) use ($promise) {
        var_dump($promise->getRequest()->getUri()->getHost());
        var_dump($response->getStatusCode());
        return $response;
    });
}

$http->wait();
```

Если не вызвать `$http->wait()` явно, очередь запросов выполнится в фоновом задании ядра. Это ускоряет отдачу страницы пользователю. Используйте такой подход, когда результаты не нужно показывать — например, при отправке уведомлений. В этом случае замените `var_dump()` на `AddMessage2Log()`.

## Настроить прокси

Если запросы к внешним сервисам нужно отправлять через прокси-сервер, при создании клиента укажите хост и порт прокси. Для аутентификации добавьте логин и пароль.

```php
$http = new HttpClient([
    'proxyHost' => '185.135.157.89',
    'proxyPort' => '8080',
]);
```

Клиент поддерживает работу через HTTP и HTTPS прокси.

Для схемы `http://` клиент делает запрос через прокси с указанием полного URI вида:

```
GET http://www.1c-bitrix.ru/ HTTP/1.1
```

Для схемы `https://` клиент использует метод `CONNECT` к прокси. После установления туннеля к хосту сокет переключается в защищенный режим и обмен с хостом происходит обычным образом:

```
CONNECT www.1c-bitrix.ru:443 HTTP/1.1
```

Следует иметь в виду, что прокси-серверы могут быть довольно ограниченными. Бесперебойная работа не гарантируется. Попробуйте cURL — у него более развитая поддержка прокси.

## Использовать cURL

По умолчанию клиент работает через PHP-сокеты. С версии PHP 8.0 можно подключить библиотеку cURL. Она работает быстрее, особенно при множественных или асинхронных запросах.

Включите cURL с помощью параметра `useCurl => true` в конструкторе или в настройках по умолчанию.

```php
$http = new HttpClient([
    'useCurl' => true,
    'curlLogFile' => '/home/bitrix/www/curl.log',
]);
```

Параметр `curlLogFile` указывает путь к файлу, в который система записывает отладочные сообщения cURL. Это помогает диагностировать ошибки подключения.

## Настроить запросы через события

Событие `OnHttpClientBuildRequest` доступно с версии 23.800.0 главного модуля. Оно срабатывает перед каждым запросом, который отправляет `HttpClient` в рамках одного скрипта — после создания объекта запроса, но до его отправки.

Событие позволяет настроить параметры клиента и изменить объект запроса. Объекты PSR-7 являются неизменяемыми (`immutable`), поэтому выполняйте изменения через методы `with*`. Они создают новую копию объекта с обновленными данными.

{% note info "" %}

Событие работает только при включенной опции `sendEvents`. По умолчанию она установлена в `true`.

{% endnote %}

Чтобы использовать событие, выполните четыре действия.

1. Зарегистрируйте обработчик.

2. Получите текущий клиент и запрос в обработчике.

3. Создайте новый объект запроса с нужными изменениями.

4. Верните его в результате события типа `\Bitrix\Main\Web\Http\RequestEventResult`.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'main',
    'OnHttpClientBuildRequest',
    'MyOnHttpClientBuildRequest'
);

function MyOnHttpClientBuildRequest(\Bitrix\Main\Web\Http\RequestEvent $event)
{
    $client = $event->getClient();
    $client->setProxy('');

    $request = $event->getRequest();
    $request = $request->withHeader('MyHeader', 'MyValue');

    $result = new \Bitrix\Main\Web\Http\RequestEventResult($request);
    $event->addResult($result);
}
```

## Настроить журналирование запросов

Клиент поддерживает стандарт PSR-3. Рекомендуется настраивать логи в файле `.settings.php`.

{% note tip "" %}

Подробную информацию читайте в статье [Логгеры](./logger.md).

{% endnote %}

### Записать каждый запрос в отдельный файл

Передайте в конструктор логгера объект запроса. Используйте `spl_object_hash()` для уникального имени файла.

```php
return [
    'loggers' => [
        'value' => [
            'main.HttpClient' => [
                'constructor' => function (\Bitrix\Main\Web\Http\DebugInterface $debug, \Psr\Http\Message\RequestInterface $request) { 
                    $debug->setDebugLevel(\Bitrix\Main\Web\HttpDebug::ALL);
                    return new \Bitrix\Main\Diag\FileLogger('/home/bitrix/www/httplog'. spl_object_hash($request) . '.log');
                },
                'level' => \Psr\Log\LogLevel::DEBUG,
            ],
        ],
    ],
];
```

### Записать только URL внешних обращений

Используйте кастомный форматтер, чтобы зафиксировать факт обращения к внешнему ресурсу. Он запишет только URL запроса и текущий URI страницы.

```php
return [
    'loggers' => [
        'value' => [
            'main.HttpClient' => [
                'constructor' => function (\Bitrix\Main\Web\Http\DebugInterface $debug, \Psr\Http\Message\RequestInterface $request) {
                    $debug->setDebugLevel(\Bitrix\Main\Web\HttpDebug::REQUEST_HEADERS);

                    $logger = new \Bitrix\Main\Diag\FileLogger($_SERVER['DOCUMENT_ROOT'] . '/http.log');

                    $logger->setFormatter(
                        new class($request) implements \Bitrix\Main\Diag\LogFormatterInterface 
                        {
                            public function __construct(public \Psr\Http\Message\RequestInterface $request) {}

                            public function format($message, array $context = []): string
                            {
                                // Игнорировать запросы push-сервера
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
];
```