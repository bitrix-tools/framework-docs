---
title: Задать префикс пути Options::prefix
description: Метод Routing\Options::prefix задает префикс пути маршрута или группы маршрутов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::prefix` задает префикс пути. В файле маршрутов метод конфигуратора `prefix` перед `group` задает префикс всем маршрутам группы.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function prefix($prefix)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| prefix\* | `string` | Задает префикс без косых черт в начале и в конце, например `api` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает и заменяет собственный префикс. Метод не меняет префиксы родительских групп, которые добавил [mergeWith](merge-with.md).

Префикс с косой чертой в начале дает двойную косую черту в шаблоне маршрута.

## Примеры

**Пример.** Код задает префикс и выводит полный префикс:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->prefix('api');

echo $options->getFullPrefix();
```

Код выведет `/api`.

## Смотрите также

- [Options::getFullPrefix](get-full-prefix.md)
- [Роутинг](../../../../framework/routing.md#group-prefix)
