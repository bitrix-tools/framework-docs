---
title: Получить IP-адрес сервера HttpClient::getPeerAddress
description: Метод HttpClient::getPeerAddress возвращает IP-адрес сервера последнего запроса, если запросы к частным адресам запрещены.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getPeerAddress` возвращает IP-адрес сервера, к которому подключился клиент. Метод нужен, например, чтобы записать адрес в журнал внешних обращений.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getPeerAddress()
```

## Возвращаемое значение

Метод возвращает IP-адрес строкой, только если запросы к частным адресам запрещены методом [setPrivateIp](set-private-ip.md). Иначе метод возвращает `false`.

## Особенности

Метод возвращает адрес, который клиент нашел в DNS для хоста запроса. При работе через прокси клиент подключается к прокси, но метод вернет адрес хоста запроса.

## Примеры

**Пример.** Код запрещает частные адреса и читает IP-адрес сервера:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient(['privateIp' => false]);
$client->get('https://example.org/');
$ip = $client->getPeerAddress();

echo (filter_var($ip, FILTER_VALIDATE_IP) ? 'ip received' : 'no ip');
```

Код выведет `ip received`.

## Смотрите также

- [HttpClient::setPrivateIp](set-private-ip.md)
