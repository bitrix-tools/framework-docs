---
title: Получить настройки маршрута Route::getOptions
description: Метод Route::getOptions возвращает объект Options с HTTP-методами, префиксом, именем, регулярными выражениями и значениями по умолчанию параметров маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::getOptions` возвращает настройки маршрута. Конфигурация маршрута `RoutingConfiguration` задает настройки методом [setOptions](set-options.md).

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function getOptions()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Routing\Options` или `null` до вызова `setOptions`. Объект хранит настройки из файла маршрутов:

- `getMethods` — HTTP-методы, например `['GET', 'HEAD']` для маршрута из метода `get`,
- `getFullPrefix` — префиксы групп,
- `getFullName` — полное имя маршрута,
- `getWhere` — регулярные выражения параметров из метода `where`,
- `getDefault` — значения по умолчанию из метода `default`.

Из настроек группы маршрут получает только регулярные выражения `where`, префикс, имя и промежуточные обработчики. Значения `default` и HTTP-методы, заданные на группе, до маршрутов группы не доходят.

## Примеры

**Пример.** Код объявляет именованный маршрут и выводит его имя и HTTP-методы:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->get('/units/{code}/', static fn() => 'unit')
    ->name('unit.view')
;
$router->releaseRoutes();

$options = $router->getRoutes()[0]->getOptions();

echo $options->getFullName() . ' ' . implode(',', $options->getMethods());
```

Код выведет `unit.view GET,HEAD`.

## Смотрите также

- [Route::setOptions](set-options.md)
- [Роутинг](../../../../framework/routing.md#http-methods)
