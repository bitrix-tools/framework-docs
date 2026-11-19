---
title: Проверить пустой пресет Options::isDefaultFilter
description: Статический метод Options::isDefaultFilter проверяет, что код пресета равен default_filter — пустому фильтру.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::isDefaultFilter` проверяет, что код пресета равен `default_filter`. Этот пресет означает пустой фильтр, и [getFilter](get-filter.md) для него возвращает пустой массив.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function isDefaultFilter($presetId = "")
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId | `string` | Задает код пресета. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если код равен `'default_filter'`, иначе `false`.

## Примеры

**Пример.** Код проверяет текущий пресет нового фильтра:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');

var_dump(Options::isDefaultFilter($options->getCurrentFilterId()));
```

Код выведет `bool(true)`.

## Смотрите также

- [Options::getFilter](get-filter.md)
