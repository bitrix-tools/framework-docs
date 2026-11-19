---
title: Найти маршрут для запроса Router::match
description: Метод Router::match находит первый маршрут, который подходит пути и HTTP-методу запроса, и заполняет значения его параметров.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::match` находит маршрут для HTTP-запроса. Ядро вызывает его в файле `/bitrix/routing_index.php`, чтобы выбрать обработчик страницы.

Сигнатура метода в классе `Bitrix\Main\Routing\Router`:

```php
public function match($request)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Bitrix\Main\HttpRequest` | Задает запрос, для которого нужен маршрут |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Routing\Route` или `null`, если подходящего маршрута нет.

Метод берет путь из URL запроса без строки запроса, схемы и домена и декодирует его функцией `urldecode`. Метод проверяет маршруты в порядке объявления и возвращает первый, который подходит пути. Если у маршрута заданы HTTP-методы, метод запроса тоже должен входить в этот список.

Метод записывает в найденный маршрут значения параметров из пути и значения по умолчанию. Методы маршрута `getParametersValues` и `getParameterValue` возвращают эти значения.

## Примеры

**Пример.** Код объявляет маршрут с параметром, создает запрос `GET /units/kg/` и выводит значение параметра найденного маршрута:

```php
<?php
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;
use Bitrix\Main\Server;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->get('/units/{code}/', static fn() => 'unit')
    ->name('unit.view')
;
$router->releaseRoutes();

$server = new Server([
    'REQUEST_URI' => '/units/kg/',
    'REQUEST_METHOD' => 'GET',
    'QUERY_STRING' => '',
]);
$request = new HttpRequest($server, [], [], [], []);

$route = $router->match($request);

echo $route === null ? 'Not found' : $route->getParameterValue('code');
```

Код выведет `kg`.

## Смотрите также

- [Router::route](route.md)
- [Router::getRoutes](get-routes.md)
