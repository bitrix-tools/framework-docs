---
title: Получить копию с другим портом Uri::withPort
description: Метод Uri::withPort возвращает копию адреса с другим портом или без порта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::withPort` возвращает копию адреса с другим портом. Метод не меняет исходный объект. Метод входит в интерфейс PSR-7 `UriInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function withPort(?int $port): UriInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| port\* | `int` или `null` | Задает порт. Значение `null` убирает порт, тогда [getPort](get-port.md) вернет порт по умолчанию для схемы |

## Возвращаемое значение

Метод возвращает новый объект `Uri`.

## Особенности

Метод не проверяет диапазон порта. Метод [getUri](get-uri.md) не выводит стандартный порт схемы, например 443 для `https`, и порт для схем, кроме `http` и `https`.

## Примеры

**Пример.** Код переводит адрес на порт 8443:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/units/');

echo $uri->withPort(8443)->getUri() . ' ' . $uri->withPort(443)->getUri();
```

Код выведет `https://example.com:8443/units/ https://example.com/units/`.

## Смотрите также

- [Uri::getPort](get-port.md)
