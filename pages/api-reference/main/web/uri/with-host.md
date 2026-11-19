---
title: Получить копию с другим хостом Uri::withHost
description: Метод Uri::withHost возвращает копию адреса с другим хостом в нижнем регистре.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::withHost` возвращает копию адреса с другим хостом. Метод не меняет исходный объект. Метод входит в интерфейс PSR-7 `UriInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function withHost(string $host): UriInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| host\* | `string` | Задает хост без схемы и порта. Метод приводит его к нижнему регистру |

## Возвращаемое значение

Метод возвращает новый объект `Uri`.

## Примеры

**Пример.** Код строит ссылку на зеркало сайта:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/units/?page=2');

echo $uri->withHost('Mirror.Example.COM')->getUri();
```

Код выведет `https://mirror.example.com/units/?page=2`.

## Смотрите также

- [Uri::setHost](set-host.md)
