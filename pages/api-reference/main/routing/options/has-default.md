---
title: Проверить, задано ли значение параметра по умолчанию Options::hasDefault
description: Метод Routing\Options::hasDefault проверяет, задано ли значение параметра маршрута по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::hasDefault` проверяет, задано ли значение параметра по умолчанию методом [default](default.md).

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function hasDefault($parameter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameter\* | `string` | Задает имя параметра |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если значение задано, иначе `false`. Для значения `null` метод тоже возвращает `true`.

## Примеры

**Пример.** Код проверяет два параметра:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->default('page', '1');

var_export([$options->hasDefault('page'), $options->hasDefault('code')]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [Options::default](default.md)
- [Options::getDefault](get-default.md)
