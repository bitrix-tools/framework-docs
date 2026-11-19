---
title: Задать HTTP-прокси HttpClient::setProxy
description: Метод HttpClient::setProxy задает HTTP-прокси, через который клиент отправляет запросы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setProxy` задает HTTP-прокси для запросов. Прокси нужен, когда сервер выходит в интернет только через него.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setProxy($proxyHost, $proxyPort = null, $proxyUser = null, $proxyPassword = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| proxyHost\* | `string` | Задает имя или адрес прокси без `http://` |
| proxyPort | `int` или `null` | Задает порт. Если порт не больше 0, метод оставляет прежний. Начальное значение — `80` |
| proxyUser | `string` или `null` | Задает имя пользователя прокси. По умолчанию — `null` |
| proxyPassword | `string` или `null` | Задает пароль прокси. По умолчанию — `null` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Если задано имя пользователя, клиент отправляет заголовок `Proxy-Authorization` со схемой Basic.
- Ключи `proxyHost`, `proxyPort`, `proxyUser` и `proxyPassword` секции `http_client_options` файла `.settings.php` задают прокси для всех клиентов.

## Примеры

**Пример.** Код отправляет запрос через недоступный прокси и обрабатывает ошибку:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient(['socketTimeout' => 5]);
$client->setProxy('proxy.invalid', 3128, 'units', 'secret');
$result = $client->get('https://example.org/');

echo var_export($result, true) . ' ' . implode(',', array_keys($client->getError()));
```

Код выведет `false NETWORK`.

## Смотрите также

- [HTTP-клиент](../../../../advanced/http-client.md)
