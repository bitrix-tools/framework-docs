---
title: Получить адрес целиком Uri::getUri
description: Метод Uri::getUri собирает адрес из частей вместе с фрагментом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.10

{% endnote %}

Метод `Uri::getUri` собирает адрес из частей вместе с фрагментом после `#`. Приведение объекта к строке и [jsonSerialize](json-serialize.md) возвращают то же значение.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getUri()
```

## Возвращаемое значение

Метод возвращает строку.

## Особенности

Метод добавляет порт в адрес только для схем `http` и `https` и только нестандартный, то есть не 80 и не 443. Для других схем и для адреса без схемы порт в строку не попадает, хотя [getPort](get-port.md) его возвращает. Например, `ftp://example.com:2121/` станет `ftp://example.com/`.

## Примеры

**Пример.** Код меняет параметр и собирает адрес:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com:443/units/?page=2#top');
$uri->addParams(['page' => 3]);

echo $uri->getUri();
```

Код выведет `https://example.com/units/?page=3#top`.

## Смотрите также

- [Uri::getLocator](get-locator.md)
- [Uri::getPathQuery](get-path-query.md)
