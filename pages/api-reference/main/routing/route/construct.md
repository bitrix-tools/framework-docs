---
title: Создать маршрут Route::__construct
description: Конструктор Route сохраняет шаблон URL и обработчик маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Route::__construct` создает маршрут из шаблона URL и обработчика. Конструктор только сохраняет аргументы. В файлах маршрутов маршруты создает конфигуратор `RoutingConfigurator` методами `get`, `post` и другими.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function __construct($uri, $controller)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| uri\* | `string` | Задает шаблон URL. Параметр шаблона указывайте в фигурных скобках, например `/units/{code}/`. Имя параметра — латинские буквы, цифры и `_` |
| controller\* | `mixed` | Задает обработчик маршрута, например замыкание или массив из имени класса контроллера и имени действия |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Особенности

Перед вызовом [match](match.md) задайте настройки методом [setOptions](set-options.md). Без настроек метод `match` вызывает ошибку `Error`, когда путь подходит под шаблон.

## Примеры

**Пример.** Код создает маршрут с пустыми настройками и проверяет путь:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$route = new Route('/units/{code}/', static fn() => 'unit');
$route->setOptions(new Options());

var_export($route->match('/units/kg/'));
```

Код выведет:

```text
array (
  'code' => 'kg',
)
```

## Смотрите также

- [Route::setOptions](set-options.md)
- [Route::match](match.md)
- [Роутинг](../../../../framework/routing.md)
