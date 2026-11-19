---
title: Получить кодировку HttpHeaders::getCharset
description: Метод HttpHeaders::getCharset возвращает кодировку из атрибута charset заголовка Content-Type.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getCharset` возвращает кодировку из атрибута `charset` заголовка `Content-Type`. Метод вызывает [getContentTypeAttribute](get-content-type-attribute.md) с именем `charset`.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getCharset()
```

## Возвращаемое значение

Метод возвращает значение атрибута в исходном регистре или `null`, если атрибута нет.

## Особенности

Метод не убирает кавычки. Для `charset="UTF-8"` метод вернет `"UTF-8"` с кавычками. Перед сравнением уберите кавычки и приведите значение к одному регистру.

## Примеры

**Пример.** Код читает кодировку и приводит ее к виду для сравнения:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'text/html; charset="UTF-8"']);
$charset = $headers->getCharset();

echo $charset . ' ' . strtolower(trim($charset, '"'));
```

Код выведет `"UTF-8" utf-8`.

## Смотрите также

- [HttpHeaders::getContentType](get-content-type.md)
- [HttpHeaders::getContentTypeAttribute](get-content-type-attribute.md)
