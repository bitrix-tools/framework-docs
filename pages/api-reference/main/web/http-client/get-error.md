---
title: Получить ошибки запроса HttpClient::getError
description: Метод HttpClient::getError возвращает ошибки последнего запроса массивом «код — сообщение».
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getError` возвращает ошибки последнего запроса. Метод нужен, когда [get](get.md), [post](post.md) или [query](query.md) вернули `false`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getError()
```

## Возвращаемое значение

Метод возвращает массив. Ключ — код ошибки, значение — сообщение на английском. Если ошибок нет, метод возвращает пустой массив.

| Код | Когда возникает |
| --- | --- |
| `URI_SCHEME` | Схема адреса не `http` и не `https`, в том числе для относительного адреса |
| `URI_HOST` | В адресе нет хоста |
| `URI_PUNICODE` | Хост не удалось перевести в Punycode |
| `PRIVATE_IP` | Адрес частный или хост не найден в DNS, а запросы к частным адресам запрещены методом [setPrivateIp](set-private-ip.md) |
| `NETWORK` | Ошибка сети, например хост не найден, сервер не отвечает, превышено время ожидания или размер ответа |
| `REDIRECT` | Превышено число редиректов из [setRedirect](set-redirect.md) |
| `MULTIPART` | Данные для `multipart/form-data` в [post](post.md) неверные |

## Особенности

- Ответ с кодом ошибки HTTP, например 404 или 500, не попадает в этот массив. Проверяйте код методом [getStatus](get-status.md).
- Ошибки `REDIRECT` и `MULTIPART` клиент также выдает как предупреждение PHP `E_USER_WARNING`.
- При ошибке `MULTIPART` запрос не уходит, и ошибки предыдущего запроса остаются в массиве.

## Примеры

**Пример.** Код обрабатывает ошибку неверного адреса:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();

if ($client->get('ftp://example.org/units.csv') === false)
{
    foreach ($client->getError() as $code => $message)
    {
        echo $code . ': ' . $message;
    }
}
```

Код выведет `URI_SCHEME: Only http and https shemes are supported.`.

## Смотрите также

- [HttpClient::getStatus](get-status.md)
