---
title: Задать HTTP-методы маршрута Options::methods
description: Метод Routing\Options::methods задает список HTTP-методов, на которые отвечает маршрут.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::methods` задает HTTP-методы, на которые отвечает маршрут. Методы конфигурации маршрута `RoutingConfiguration` — `get`, `post`, `match` и другие — вызывают его сами. Например, `get` задает `['GET', 'HEAD']`.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function methods($methods)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| methods\* | `array` | Задает HTTP-методы в верхнем регистре, например `['GET', 'POST']` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает и заменяет прежний список.

Метод [Router::match](../router/match.md) сравнивает метод запроса со списком с учетом регистра. Пустой список означает любой HTTP-метод.

## Примеры

**Пример.** Код задает HTTP-методы и читает их:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->methods(['GET', 'POST']);

echo implode(',', $options->getMethods());
```

Код выведет `GET,POST`.

## Смотрите также

- [Options::getMethods](get-methods.md)
- [Роутинг](../../../../framework/routing.md#http-methods)
