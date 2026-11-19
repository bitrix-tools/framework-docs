---
title: Задать регулярное выражение параметра Options::where
description: Метод Routing\Options::where задает регулярное выражение, под которое должно подходить значение параметра маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::where` задает регулярное выражение для параметра маршрута. Метод [Route::compile](../route/compile.md) подставляет выражение в шаблон вместо `[^/]+`.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function where($parameter, $pattern)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameter\* | `string` | Задает имя параметра без фигурных скобок, например `code` |
| pattern\* | `string` | Задает регулярное выражение без разделителей и якорей, например `[a-z]+` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Повторный вызов для того же параметра заменяет выражение.

Выражения группы переходят к ее маршрутам через [mergeWith](merge-with.md).

## Примеры

**Пример.** Код задает выражение для параметра `code` и проверяет два пути:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->where('code', '[a-z]+');

$route = new Route('/units/{code}/', static fn() => 'unit');
$route->setOptions($options);

var_export([(bool) $route->match('/units/kg/'), (bool) $route->match('/units/12/')]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [Options::getWhere](get-where.md)
- [Роутинг](../../../../framework/routing.md#parameter-patterns)
