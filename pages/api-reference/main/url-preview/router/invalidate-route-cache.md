---
title: Очистить кеш маршрутов Router::invalidateRouteCache
description: Метод UrlPreview\Router::invalidateRouteCache очищает управляемый кеш маршрутов предпросмотра ссылок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::invalidateRouteCache` очищает управляемый кеш с маршрутами предпросмотра. Вызовите его после того, как изменили или удалили записи `Bitrix\Main\UrlPreview\RouteTable` напрямую. Метод [setRouteHandler](set-route-handler.md) очищает кеш сам.

Сигнатура метода в классе `Bitrix\Main\UrlPreview\Router`:

```php
public static function invalidateRouteCache()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод очищает только кеш. Маршруты, которые [dispatch](dispatch.md) уже прочитал в текущем запросе, остаются в памяти до конца запроса.

## Примеры

**Пример.** Код очищает кеш маршрутов предпросмотра:

```php
<?php
use Bitrix\Main\UrlPreview\Router;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Router::invalidateRouteCache();

echo 'Cache cleared';
```

## Смотрите также

- [Router::setRouteHandler](set-route-handler.md)
- [Router::dispatch](dispatch.md)
