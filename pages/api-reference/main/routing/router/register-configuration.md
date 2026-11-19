---
title: Добавить настройку маршрута Router::registerConfiguration
description: Метод Router::registerConfiguration добавляет настройку маршрута, из которой releaseRoutes создает маршрут.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::registerConfiguration` добавляет настройку маршрута в список маршрутизатора. Объект `RoutingConfigurator` вызывает метод сам для каждого маршрута, который объявляют методами `get`, `post`, `any` и другими. Маршрут из настройки появится в списке только после вызова [releaseRoutes](release-routes.md).

Сигнатура метода в классе `Bitrix\Main\Routing\Router`:

```php
public function registerConfiguration($configuration)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| configuration\* | `Bitrix\Main\Routing\RoutingConfiguration` | Задает настройку маршрута |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код создает настройку через `RoutingConfigurator::createConfiguration`, который вызывает `registerConfiguration`. После `releaseRoutes` маршрутизатор получает один маршрут:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->createConfiguration()
    ->get('/units/', static fn() => 'units')
;
echo count($router->getRoutes()) . PHP_EOL;

$router->releaseRoutes();
echo count($router->getRoutes());
```

Код выведет `0` и `1`.

## Смотрите также

- [Router::releaseRoutes](release-routes.md)
