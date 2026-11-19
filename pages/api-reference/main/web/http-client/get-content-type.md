---
title: Получить тип содержимого ответа HttpClient::getContentType
description: Метод HttpClient::getContentType возвращает тип содержимого из заголовка Content-Type последнего ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::getContentType` возвращает тип содержимого последнего ответа, например `application/json`. Метод вызывает [getContentType](../http-headers/get-content-type.md) объекта заголовков ответа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function getContentType()
```

## Возвращаемое значение

Метод возвращает тип в нижнем регистре без атрибутов или `null`, если заголовка `Content-Type` нет.

## Примеры

**Пример.** Код разбирает тело, только если это JSON:

```php
<?php
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$client = new HttpClient();
$body = $client->get('https://postman-echo.com/get?unit=kg');

if ($client->getContentType() === 'application/json')
{
    echo Json::decode($body)['args']['unit'];
}
```

Код выведет `kg`.

## Смотрите также

- [HttpClient::getCharset](get-charset.md)
