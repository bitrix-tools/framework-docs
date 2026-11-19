---
title: Задать параметры контекста потока HttpClient::setContextOptions
description: Метод HttpClient::setContextOptions задает параметры контекста потока PHP, например настройки SSL.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setContextOptions` задает параметры контекста потока PHP для подключения. Метод нужен для тонкой настройки SSL, например чтобы указать свой корневой сертификат или клиентский сертификат.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setContextOptions(array $options)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| options\* | `array` | Задает параметры в формате `stream_context_create`, например `['ssl' => ['cafile' => '/path/ca.pem']]` |

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Метод объединяет новые параметры с прежними через функцию `array_replace_recursive`.
- Метод [disableSslVerification](disable-ssl-verification.md) перезаписывает параметры `verify_peer`, `verify_peer_name` и `allow_self_signed`.
- Параметры работают для подключения через сокеты. При работе через cURL клиент берет из них только `verify_peer` и `verify_peer_name`.

## Примеры

**Пример.** Код задает параметры SSL и отправляет запрос:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setContextOptions(['ssl' => ['verify_peer' => true, 'SNI_enabled' => true]]);
$client->get('https://example.org/');

echo $client->getStatus();
```

Код выведет `200`.

## Смотрите также

- [HttpClient::disableSslVerification](disable-ssl-verification.md)
