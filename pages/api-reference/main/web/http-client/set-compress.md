---
title: Включить сжатие ответа HttpClient::setCompress
description: Метод HttpClient::setCompress добавляет заголовок Accept-Encoding gzip, чтобы сервер сжал ответ.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setCompress` включает или выключает запрос сжатого ответа. Если сжатие включено, клиент отправляет заголовок `Accept-Encoding: gzip`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setCompress($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `bool` | Значение `true` запрашивает сжатый ответ. Начальное значение — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Клиент распаковывает ответ с заголовком `Content-Encoding: gzip` всегда, даже без этого метода. Метод [getResult](get-result.md) возвращает распакованное тело, а заголовок `Content-Encoding` клиент удаляет из ответа.
- Клиент распаковывает только gzip. Если запросить другое сжатие, например `br`, заголовком через [setHeader](set-header.md), тело вернется сжатым.

## Примеры

**Пример.** Код запрашивает сжатый ответ:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$client->setCompress(true);
$data = Json::decode($client->get('https://postman-echo.com/get?unit=kg'));

echo $client->getRequestHeaders()->get('Accept-Encoding') . ' ' . $data['args']['unit'];
```

Код выведет `gzip kg`.

## Смотрите также

- [HttpClient::getResult](get-result.md)
