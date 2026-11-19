---
title: Перевести хост в Punycode Uri::convertToPunycode
description: Метод Uri::convertToPunycode переводит хост с национальными символами в Punycode и сохраняет его в объекте.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::convertToPunycode` переводит хост с национальными символами в Punycode, например `пример.рф` в `xn--e1afmkfd.xn--p1ai`. Метод нужен перед DNS-запросом к такому хосту или перед передачей адреса во внешнюю систему. Класс `HttpClient` переводит хост в Punycode сам.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function convertToPunycode()
```

## Возвращаемое значение

Метод возвращает хост в Punycode и сохраняет его в объекте. Если хост состоит только из латиницы, цифр, точек и дефисов, метод возвращает его без изменений. При ошибке преобразования метод возвращает объект `Bitrix\Main\Error` и не меняет хост.

## Особенности

Метод переводит только хост. Путь с национальными символами закодируйте отдельно, например методом [urnEncode](urn-encode.md).

## Примеры

**Пример.** Код переводит кириллический домен в Punycode:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://пример.рф/units/');
$result = $uri->convertToPunycode();

echo ($result instanceof Error ? $result->getMessage() : $uri->getUri());
```

Код выведет `https://xn--e1afmkfd.xn--p1ai/units/`.

## Смотрите также

- [Uri::convertToUnicode](convert-to-unicode.md)
