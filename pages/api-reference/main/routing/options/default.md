---
title: Задать значение параметра по умолчанию Options::default
description: Метод Routing\Options::default задает значение параметра маршрута по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::default` задает значение параметра маршрута по умолчанию. Значение нужно в трех случаях:

- параметр шаблона может быть пустым, например `/units/{page}/` для пути `/units//`,
- метод [Router::route](../router/route.md) строит URL без значения параметра,
- параметра нет в шаблоне, но обработчик должен его получить.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function default($parameter, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameter\* | `string` | Задает имя параметра |
| value\* | `mixed` | Задает значение |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Повторный вызов для того же параметра заменяет значение.

## Особенности

- Для параметра со значением по умолчанию метод [Route::compile](../route/compile.md) разрешает пустое значение в пути, если для параметра не задано регулярное выражение [where](where.md).
- Значения по умолчанию группы не переходят к ее маршрутам. Задавайте их у каждого маршрута.

## Примеры

**Пример.** Код задает значение параметра `page` по умолчанию и проверяет путь без номера страницы:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->default('page', '1');

$route = new Route('/units/{page}/', static fn() => 'units');
$route->setOptions($options);

echo json_encode($route->match('/units//'));
```

Код выведет `{"page":"1"}`.

## Смотрите также

- [Options::getDefault](get-default.md)
- [Роутинг](../../../../framework/routing.md#default-values)
