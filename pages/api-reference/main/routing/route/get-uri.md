---
title: Получить шаблон URL маршрута Route::getUri
description: Метод Route::getUri возвращает шаблон URL маршрута вместе с префиксами групп.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::getUri` возвращает шаблон URL маршрута. Если в настройках есть префикс, метод добавляет его перед шаблоном.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
function getUri()
```

В объявлении нет модификатора видимости, поэтому метод публичный.

## Возвращаемое значение

Метод возвращает строку. Без префикса метод возвращает шаблон из конструктора. С префиксом метод возвращает косую черту, префиксы групп через `/`, еще одну косую черту и шаблон. Например, префиксы `blog` и `post` и шаблон `{code}` дают `/blog/post/{code}`.

Если шаблон или префикс начинается с `/`, метод возвращает двойную косую черту, например `/api//units/`. В группе с префиксом пишите шаблон и префикс без ведущей косой черты.

Метод запоминает результат при первом вызове и не учитывает настройки, заданные после него.

## Примеры

**Пример.** Код объявляет маршрут в группе с префиксом и выводит его шаблон:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->prefix('units')
    ->group(static function (RoutingConfigurator $routes)
    {
        $routes->get('{code}/', static fn() => 'unit');
    })
;
$router->releaseRoutes();

echo $router->getRoutes()[0]->getUri();
```

Код выведет `/units/{code}/`.

## Смотрите также

- [Route::getOptions](get-options.md)
- [Роутинг](../../../../framework/routing.md#group-prefix)
