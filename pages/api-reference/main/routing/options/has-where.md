---
title: Проверить, задано ли регулярное выражение параметра Options::hasWhere
description: Метод Routing\Options::hasWhere проверяет, задано ли регулярное выражение для параметра маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::hasWhere` проверяет, задано ли регулярное выражение для параметра. Метод [Route::compile](../route/compile.md) вызывает его для каждого параметра шаблона.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function hasWhere($parameter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameter\* | `string` | Задает имя параметра |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если выражение задал метод [where](where.md) или метод [mergeWith](merge-with.md) добавил его из настроек родительской группы, иначе `false`.

## Примеры

**Пример.** Код проверяет два параметра:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->where('code', '[a-z]+');

var_export([$options->hasWhere('code'), $options->hasWhere('page')]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [Options::where](where.md)
- [Options::getWhere](get-where.md)
