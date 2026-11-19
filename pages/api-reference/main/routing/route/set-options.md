---
title: Задать настройки маршрута Route::setOptions
description: Метод Route::setOptions задает маршруту объект Options с HTTP-методами, префиксом, именем и настройками параметров.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::setOptions` задает маршруту объект настроек. Метод `release` класса `RoutingConfiguration` вызывает `setOptions`, когда метод [Router::releaseRoutes](../router/release-routes.md) переносит маршруты в маршрутизатор.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function setOptions($options)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| options\* | `Bitrix\Main\Routing\Options` | Задает настройки маршрута |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод [match](match.md) читает значения по умолчанию из настроек. Без настроек метод `match` вызывает ошибку `Error`, когда путь подходит под шаблон.
- Методы [getUri](get-uri.md) и [compile](compile.md) запоминают результат при первом вызове. Методы не учитывают префикс и регулярные выражения параметров из настроек, заданных после первого вызова.

## Примеры

**Пример.** Код задает маршруту регулярное выражение параметра и значение по умолчанию для параметра, которого нет в шаблоне:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->where('code', '[a-z]+');
$options->default('view', 'short');

$route = new Route('/units/{code}/', static fn() => 'unit');
$route->setOptions($options);

var_export($route->match('/units/kg/'));
```

Код выведет:

```text
array (
  'code' => 'kg',
  'view' => 'short',
)
```

## Смотрите также

- [Route::getOptions](get-options.md)
- [Route::match](match.md)
