---
title: Создать HTTP-клиент HttpClient::__construct
description: Конструктор HttpClient создает клиент и применяет настройки из массива и из секции http_client_options файла .settings.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `HttpClient::__construct` создает HTTP-клиент. Настройки можно передать массивом или задать позже методами `set*`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function __construct(?array $options = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| options | `array` или `null` | Задает настройки клиента. Ключи перечислены ниже. По умолчанию — `null` |

Ключи массива `options`:

| Ключ | Тип | Описание |
| --- | --- | --- |
| `redirect` | `bool` | Переходить по редиректам. По умолчанию `true`. Метод [setRedirect](set-redirect.md) |
| `redirectMax` | `int` | Максимальное число редиректов. По умолчанию `5`. Действует только вместе с ключом `redirect` |
| `waitResponse` | `bool` | Читать тело ответа. По умолчанию `true`. Метод [waitResponse](wait-response.md) |
| `socketTimeout` | `int` | Время ожидания подключения в секундах. По умолчанию `30` |
| `streamTimeout` | `int` | Время ожидания чтения ответа в секундах. По умолчанию `60` |
| `version` | `string` | Версия HTTP — `HttpClient::HTTP_1_0` или `HttpClient::HTTP_1_1`. По умолчанию `'1.1'` |
| `proxyHost`, `proxyPort`, `proxyUser`, `proxyPassword` | `string`, `int` | Настройки прокси. Метод [setProxy](set-proxy.md) |
| `compress` | `bool` | Запросить ответ в gzip. По умолчанию `false` |
| `charset` | `string` | Кодировка тела POST-запроса для заголовка `Content-Type` |
| `disableSslVerification` | `bool` | Значение `true` отключает проверку SSL-сертификата |
| `bodyLengthMax` | `int` | Максимальный размер тела ответа в байтах. По умолчанию `0` — без ограничения |
| `privateIp` | `bool` | Разрешить запросы к частным IP-адресам. По умолчанию `true` |
| `debugLevel` | `int` | Уровень отладки — константы `Bitrix\Main\Web\HttpDebug` |
| `cookies` | `array` | Cookie запроса «имя — значение». Метод [setCookies](set-cookies.md) |
| `headers` | `array` | Заголовки запроса «имя — значение». Метод [setHeaders](set-headers.md) |
| `useCurl` | `bool` | Отправлять запросы через cURL. По умолчанию `false`. Если расширение cURL недоступно, клиент работает через сокеты |
| `curlLogFile` | `string` | Полный путь к файлу журнала cURL |
| `sendEvents` | `bool` | Отправлять событие `OnHttpClientBuildRequest` перед запросом. По умолчанию `true` |
| `responseBuilder` | `Bitrix\Main\Web\Http\ResponseBuilderInterface` | Объект, который создает ответ. Метод [setResponseBuilder](set-response-builder.md) |

## Особенности

- Конструктор дополняет массив значениями из секции `http_client_options` файла `.settings.php`. Ключи из аргумента заменяют одноименные ключи из настроек.
- Ключи `useCurl`, `curlLogFile` и `sendEvents` можно задать только в конструкторе. Отдельных методов для них нет.

## Примеры

**Пример.** Код создает клиент с временем ожидания и заголовком:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient([
    'socketTimeout' => 10,
    'streamTimeout' => 30,
    'headers' => ['X-Units-Client' => 'catalog'],
]);

echo $client->getRequestHeaders()->toString();
```

Код выведет `X-Units-Client: catalog`.

## Смотрите также

- [HTTP-клиент](../../../../advanced/http-client.md)
- [HttpClient::get](get.md)
