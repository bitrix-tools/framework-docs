---
title: Собрать заголовок Cookie HttpCookies::implode
description: Метод HttpCookies::implode собирает cookie коллекции в строку для HTTP-заголовка Cookie.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpCookies::implode` собирает cookie коллекции в строку вида `name=value; name2=value2`. Такую строку принимает HTTP-заголовок `Cookie`. Метод `HttpClient::setCookies` вызывает `implode`, чтобы задать этот заголовок.

Сигнатура метода в классе `Bitrix\Main\Web\HttpCookies`:

```php
public function implode(): string
```

## Возвращаемое значение

Метод возвращает строку пар «имя=значение», разделенных `; `. Метод кодирует имя и значение каждой cookie функцией `rawurlencode`. Для пустой коллекции метод возвращает пустую строку.

## Примеры

**Пример.** Код собирает заголовок из двух cookie. Метод кодирует пробел в значении как `%20`:

```php
<?php
use Bitrix\Main\Web\HttpCookies;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cookies = new HttpCookies([
    'unit' => 'kg',
    'view' => 'short list',
]);

echo $cookies->implode();
```

Код выведет `unit=kg; view=short%20list`.

## Смотрите также

- [HttpCookies::addFromString](add-from-string.md)
