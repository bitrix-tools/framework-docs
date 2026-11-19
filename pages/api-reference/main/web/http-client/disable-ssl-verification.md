---
title: Отключить проверку SSL-сертификата HttpClient::disableSslVerification
description: Метод HttpClient::disableSslVerification отключает проверку SSL-сертификата сервера для запросов клиента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.9

{% endnote %}

Метод `HttpClient::disableSslVerification` отключает проверку SSL-сертификата сервера. Клиент принимает самоподписанный сертификат и сертификат для другого имени хоста.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function disableSslVerification()
```

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Без проверки сертификата злоумышленник может подменить сервер и прочитать данные запроса. Отключайте проверку только для тестовых серверов, например с самоподписанным сертификатом.
- Включить проверку обратно у того же клиента нельзя. Создайте новый объект.
- Для своего корневого сертификата используйте [setContextOptions](set-context-options.md) с ключом `cafile` в массиве `ssl` вместо отключения проверки. С cURL этот способ не работает.

## Примеры

**Пример.** Код отправляет запрос к тестовому серверу без проверки сертификата:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->disableSslVerification();
$client->get('https://example.org/');

echo $client->getStatus();
```

Код выведет `200`.

## Смотрите также

- [HttpClient::setContextOptions](set-context-options.md)
