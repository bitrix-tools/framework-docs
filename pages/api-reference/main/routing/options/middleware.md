---
title: Добавить промежуточный обработчик Options::middleware
description: Метод Routing\Options::middleware добавляет промежуточный обработчик, который ядро вызывает перед обработчиком маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::middleware` добавляет промежуточный обработчик маршрута. Файл `/bitrix/routing_index.php` вызывает промежуточные обработчики с объектом запроса перед обработчиком маршрута и до подключения пролога.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function middleware($middleware)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| middleware\* | `callable` или `array` | Задает обработчик или массив обработчиков. Обработчик получает объект `Bitrix\Main\HttpRequest`. Обработчик-массив вида `[$object, 'method']` оберните в массив, например `[[$object, 'method']]` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Метод добавляет обработчики к уже заданным, а не заменяет их.

## Особенности

- Промежуточные обработчики группы переходят к ее маршрутам через [mergeWith](merge-with.md). Во вложенных группах обработчики внешней группы попадают в маршрут дважды.
- Метод добавляет массив через `array_merge`, поэтому обработчик-массив без обертки станет двумя отдельными значениями.
- Файл `routing_index.php` вызывает только обработчики, которые проходят проверку `is_callable`. Ядро не использует значение, которое возвращает обработчик.

## Примеры

**Пример.** Код добавляет два промежуточных обработчика и считает их:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->middleware(static fn($request) => null);
$options->middleware([static fn($request) => null]);

echo count($options->getMiddlewares());
```

Код выведет `2`. Метод `getMiddlewares` внутренний, пример вызывает его только для проверки.

## Смотрите также

- [Options::mergeWith](merge-with.md)
- [Роутинг](../../../../framework/routing.md)
