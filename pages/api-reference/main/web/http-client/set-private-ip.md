---
title: Разрешить или запретить запросы к частным IP-адресам HttpClient::setPrivateIp
description: Метод HttpClient::setPrivateIp запрещает запросы к частным и локальным IP-адресам, чтобы защитить внутреннюю сеть.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setPrivateIp` разрешает или запрещает запросы к частным IP-адресам, например `10.0.0.1`, `192.168.1.1` и `127.0.0.1`. Запрет нужен, когда адрес запроса задает пользователь, например при загрузке картинки по ссылке. Так злоумышленник не сможет через сайт обратиться к серверам внутренней сети.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setPrivateIp($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `bool` | Значение `false` запрещает запросы к частным IP-адресам, `true` разрешает. Начальное значение — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Если запрет включен, клиент определяет IP-адрес хоста функцией `gethostbyname` до подключения и подключается к этому адресу. Метод [getPeerAddress](get-peer-address.md) возвращает его.
- Если адрес частный, запрос возвращает `false`, а [getError](get-error.md) возвращает ошибку с ключом `PRIVATE_IP`. Ту же ошибку клиент вернет для хоста, который не удалось найти в DNS, и для хоста только с IPv6-адресом.
- Через прокси клиент подключается к прокси, а не к найденному адресу.

## Примеры

**Пример.** Код запрещает запрос к локальному адресу:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setPrivateIp(false);
$result = $client->get('http://127.0.0.1/');

echo var_export($result, true) . ' ' . implode(',', array_keys($client->getError()));
```

Код выведет `false PRIVATE_IP`.

## Смотрите также

- [HttpClient::getPeerAddress](get-peer-address.md)
