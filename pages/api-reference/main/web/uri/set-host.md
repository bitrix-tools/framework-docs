---
title: Задать хост Uri::setHost
description: Метод Uri::setHost задает хост адреса и приводит его к нижнему регистру.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::setHost` задает хост адреса. Метод меняет сам объект. Чтобы получить копию с другим хостом, используйте [withHost](with-host.md).

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function setHost($host)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| host\* | `string` | Задает хост без схемы и порта. Метод приводит его к нижнему регистру |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Особенности

Метод не меняет схему. Если задать хост относительному адресу, [getUri](get-uri.md) вернет адрес с `//` в начале. Задайте схему методом [withScheme](with-scheme.md) или используйте [toAbsolute](to-absolute.md).

## Примеры

**Пример.** Код переносит ссылку на другой хост:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/units/?page=2');
$uri->setHost('Shop.Example.COM');

echo $uri->getUri();
```

Код выведет `https://shop.example.com/units/?page=2`.

## Смотрите также

- [Uri::getHost](get-host.md)
- [Uri::withHost](with-host.md)
