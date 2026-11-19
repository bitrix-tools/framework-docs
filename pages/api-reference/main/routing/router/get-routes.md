---
title: Получить список маршрутов Router::getRoutes
description: Метод Router::getRoutes возвращает маршруты, которые маршрутизатор получил после вызова releaseRoutes.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::getRoutes` возвращает список маршрутов в порядке объявления. В списке есть только маршруты, которые перенес метод [releaseRoutes](release-routes.md).

Сигнатура метода в классе `Bitrix\Main\Routing\Router`:

```php
public function getRoutes()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\Routing\Route`. Если маршрутов нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код выводит шаблоны URL всех маршрутов сайта:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = Application::getInstance()->getRouter();

foreach ($router->getRoutes() as $route)
{
    echo $route->getUri() . PHP_EOL;
}
```

## Смотрите также

- [Router::match](match.md)
- [Router::releaseRoutes](release-routes.md)
