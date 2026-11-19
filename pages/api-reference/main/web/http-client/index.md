---
title: HttpClient — HTTP-клиент
description: Класс Bitrix\Main\Web\HttpClient отправляет HTTP-запросы к внешним сервисам, переходит по редиректам, скачивает файлы и поддерживает PSR-18 и асинхронные запросы.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Web`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

## Когда использовать

Класс `HttpClient` отправляет HTTP-запросы к внешним сервисам, например к API платежной системы или службы доставки. Клиент работает через PHP-сокеты или через cURL.

Класс поддерживает два способа работы.

- Методы [get](get.md), [post](post.md), [head](head.md), [query](query.md) и [download](download.md) отправляют запрос по строке адреса. Они переходят по редиректам и не выбрасывают исключений при ошибке сети. Метод возвращает `false`, а [getError](get-error.md) возвращает описание ошибки.
- Методы [sendRequest](send-request.md) и [sendAsyncRequest](send-async-request.md) реализуют стандарт PSR-18. Они принимают объект запроса `Bitrix\Main\Web\Http\Request`, не переходят по редиректам и выбрасывают исключения при ошибке.

Конструктор и методы `set*` задают настройки клиента. Секция `http_client_options` файла `.settings.php` задает значения по умолчанию для всех клиентов.

Объект хранит последний полученный ответ. Методы [getStatus](get-status.md), [getHeaders](get-headers.md), [getResult](get-result.md) и [getCookies](get-cookies.md) читают его после запроса. Если запрос не удался, эти методы возвращают данные предыдущего ответа. Сначала проверяйте результат запроса.

Класс реализует интерфейсы `Psr\Http\Client\ClientInterface` и `Psr\Log\LoggerAwareInterface`. Методы `setLogger` и `setDebugLevel` включают журнал запросов.

Подробнее — в статье [HTTP-клиент](../../../../advanced/http-client.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает клиент с настройками | |
| [get](get.md) | Отправляет GET-запрос и возвращает тело ответа | |
| [post](post.md) | Отправляет POST-запрос и возвращает тело ответа | |
| [head](head.md) | Отправляет HEAD-запрос и возвращает заголовки ответа | |
| [query](query.md) | Отправляет запрос любым методом | |
| [download](download.md) | Скачивает ответ в файл | |
| [saveFile](save-file.md) | Сохраняет тело последнего ответа в файл | |
| [setHeader](set-header.md) | Задает заголовок запроса | |
| [setHeaders](set-headers.md) | Задает несколько заголовков запроса | |
| [getRequestHeaders](get-request-headers.md) | Возвращает заголовки запроса | |
| [clearHeaders](clear-headers.md) | Удаляет все заголовки запроса | |
| [setCookies](set-cookies.md) | Задает cookie запроса | |
| [setAuthorization](set-authorization.md) | Задает заголовок Basic-авторизации | |
| [setRedirect](set-redirect.md) | Включает или выключает переход по редиректам | |
| [waitResponse](wait-response.md) | Включает или выключает чтение тела ответа | |
| [shouldFetchBody](should-fetch-body.md) | Задает функцию, которая решает, читать ли тело ответа | 23.300.0 |
| [setTimeout](set-timeout.md) | Задает время ожидания подключения | |
| [setStreamTimeout](set-stream-timeout.md) | Задает время ожидания чтения ответа | |
| [setVersion](set-version.md) | Задает версию HTTP | |
| [setCompress](set-compress.md) | Включает сжатие ответа gzip | |
| [setCharset](set-charset.md) | Задает кодировку тела POST-запроса | |
| [disableSslVerification](disable-ssl-verification.md) | Отключает проверку SSL-сертификата | 15.5.9 |
| [setPrivateIp](set-private-ip.md) | Разрешает или запрещает запросы к частным IP-адресам | |
| [setProxy](set-proxy.md) | Задает HTTP-прокси | |
| [setContextOptions](set-context-options.md) | Задает параметры контекста потока PHP | |
| [setOutputStream](set-output-stream.md) | Направляет тело ответа в поток | |
| [setBodyLengthMax](set-body-length-max.md) | Ограничивает размер тела ответа | |
| [setResponseBuilder](set-response-builder.md) | Задает объект, который создает ответ | |
| [getStatus](get-status.md) | Возвращает код статуса ответа | |
| [getHeaders](get-headers.md) | Возвращает заголовки ответа | |
| [getResult](get-result.md) | Возвращает тело ответа | |
| [getResponse](get-response.md) | Возвращает объект ответа PSR-7 | |
| [getCookies](get-cookies.md) | Возвращает cookie из ответа | |
| [getContentType](get-content-type.md) | Возвращает тип содержимого ответа | |
| [getCharset](get-charset.md) | Возвращает кодировку ответа | |
| [getEffectiveUrl](get-effective-url.md) | Возвращает адрес после редиректов | |
| [getPeerAddress](get-peer-address.md) | Возвращает IP-адрес сервера | |
| [getError](get-error.md) | Возвращает ошибки последнего запроса | |
| [sendRequest](send-request.md) | Отправляет запрос PSR-18 | |
| [sendAsyncRequest](send-async-request.md) | Ставит запрос в очередь асинхронных запросов | |
| [wait](wait.md) | Ждет ответы на асинхронные запросы | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `HTTP_1_0`, `HTTP_1_1` | `'1.0'`, `'1.1'` | Версии HTTP для [setVersion](set-version.md) |
| `HTTP_GET`, `HTTP_POST`, `HTTP_PUT`, `HTTP_HEAD`, `HTTP_PATCH`, `HTTP_DELETE`, `HTTP_OPTIONS` | `'GET'`, `'POST'` и так далее | Методы HTTP для [query](query.md) |
| `DEFAULT_SOCKET_TIMEOUT` | `30` | Время ожидания подключения по умолчанию, в секундах |
| `DEFAULT_STREAM_TIMEOUT` | `60` | Время ожидания чтения ответа по умолчанию, в секундах |
| `DEFAULT_STREAM_TIMEOUT_NO_WAIT` | `1` | Время ожидания чтения после `waitResponse(false)`, в секундах |

## Смотрите также

- [HTTP-клиент](../../../../advanced/http-client.md)
- [HttpHeaders](../http-headers/index.md)
- [HttpCookies](../http-cookies/index.md)
- [Uri](../uri/index.md)
