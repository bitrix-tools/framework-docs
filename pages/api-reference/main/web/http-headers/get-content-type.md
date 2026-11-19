---
title: Получить тип содержимого HttpHeaders::getContentType
description: Метод HttpHeaders::getContentType возвращает тип содержимого из заголовка Content-Type в нижнем регистре, без атрибутов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getContentType` возвращает тип содержимого из заголовка `Content-Type`, например `application/json`. Метод отбрасывает атрибуты после точки с запятой, например `charset`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getContentType()
```

## Возвращаемое значение

Метод возвращает строку в нижнем регистре без пробелов по краям. Если заголовка `Content-Type` нет, метод возвращает `null`.

## Примеры

**Пример.** Код проверяет, что внешний сервис вернул JSON:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'Application/JSON; charset=utf-8']);

echo ($headers->getContentType() === 'application/json' ? 'json' : 'other');
```

Код выведет `json`.

## Смотрите также

- [HttpHeaders::getCharset](get-charset.md)
- [HttpHeaders::getContentTypeAttribute](get-content-type-attribute.md)
