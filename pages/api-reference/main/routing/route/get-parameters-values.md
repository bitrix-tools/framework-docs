---
title: Получить значения параметров маршрута Route::getParametersValues
description: Метод Route::getParametersValues возвращает объект Dictionary со значениями параметров маршрута из пути запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::getParametersValues` возвращает значения всех параметров маршрута. Метод [Router::match](../router/match.md) заполняет значения, когда находит маршрут для запроса.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function getParametersValues()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Type\Dictionary`. Ключи — имена параметров, значения — строки из пути или значения по умолчанию из настроек маршрута. Метод `getValues` объекта возвращает массив значений, метод `isEmpty` проверяет, есть ли значения.

Если метод `Router::match` не заполнил значения, метод возвращает пустой объект. Метод создает его при первом вызове.

Файл `/bitrix/routing_index.php` копирует значения в `$_GET` и `$_REQUEST` перед вызовом обработчика.

## Примеры

**Пример.** Код находит маршрут для запроса и выводит значения параметров:

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
    ->default('view', 'short')
;
$router->releaseRoutes();

$server = new Server([
    'REQUEST_URI' => '/units/kg/',
    'REQUEST_METHOD' => 'GET',
    'QUERY_STRING' => '',
]);
$request = new HttpRequest($server, [], [], [], []);

$route = $router->match($request);

var_export($route?->getParametersValues()->getValues());
```

Код выведет:

```text
array (
  'code' => 'kg',
  'view' => 'short',
)
```

## Смотрите также

- [Route::getParameterValue](get-parameter-value.md)
- [Router::match](../router/match.md)
