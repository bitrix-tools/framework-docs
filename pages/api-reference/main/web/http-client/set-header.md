---
title: Задать заголовок запроса HttpClient::setHeader
description: Метод HttpClient::setHeader задает заголовок для всех следующих запросов клиента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setHeader` задает заголовок запроса. Заголовок действует для всех следующих запросов этого клиента, пока его не удалит [clearHeaders](clear-headers.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setHeader($name, $value, $replace = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя заголовка. Регистр не важен |
| value\* | `string` | Задает значение |
| replace | `bool` | Значение `true` заменяет прежнее значение. Значение `false` задает заголовок, только если его еще нет. По умолчанию — `true` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\InvalidArgumentException` | Имя или значение заголовка содержит недопустимые символы, например перевод строки |

## Особенности

- С `replace = false` метод не добавляет второе значение к заголовку, а пропускает вызов.
- Клиент сам добавляет заголовки `Host`, `Connection`, `Accept` и `Accept-Language`, а для POST — `Content-Type`, если их не задали. Клиент не заменяет эти заголовки, если их задал метод.
- Клиент всегда заменяет заголовки `Accept-Encoding` после [setCompress](set-compress.md), `Authorization`, если адрес содержит учетные данные, и `Expect` при работе через cURL. При переходе по редиректу клиент удаляет заданный заголовок `Host`.

## Примеры

**Пример.** Код задает язык ответа и пробует задать его повторно без замены:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client
    ->setHeader('Accept-Language', 'ru')
    ->setHeader('Accept-Language', 'en', false)
;

echo $client->getRequestHeaders()->get('Accept-Language');
```

Код выведет `ru`.

## Смотрите также

- [HttpClient::setHeaders](set-headers.md)
- [HttpClient::getRequestHeaders](get-request-headers.md)
