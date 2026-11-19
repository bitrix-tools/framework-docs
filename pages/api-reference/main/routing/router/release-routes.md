---
title: Перенести маршруты из настроек Router::releaseRoutes
description: Метод Router::releaseRoutes переносит маршруты из добавленных настроек в список маршрутизатора и обновляет список имен.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::releaseRoutes` переносит маршруты из настроек, добавленных через [registerConfiguration](register-configuration.md), в список маршрутизатора. Приложение вызывает метод само, когда подключает файлы маршрутов в `getRouter`.

Сигнатура метода в классе `Bitrix\Main\Routing\Router`:

```php
public function releaseRoutes()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод добавляет новые маршруты в конец списка, уже перенесенные маршруты остаются. После переноса метод заново строит список именованных маршрутов для [route](route.md) и очищает список настроек. Повторный вызов без новых настроек список маршрутов не меняет.

## Примеры

**Пример.** Код объявляет два маршрута и переносит их в маршрутизатор:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->get('/units/', static fn() => 'list')
    ->name('unit.list')
;
$routes
    ->get('/units/{code}/', static fn() => 'unit')
    ->name('unit.view')
;

$router->releaseRoutes();

echo count($router->getRoutes()) . PHP_EOL;
echo $router->route('unit.list');
```

Код выведет `2` и `/units/`.

## Смотрите также

- [Router::registerConfiguration](register-configuration.md)
- [Router::getRoutes](get-routes.md)
