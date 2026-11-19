---
title: Применить значения как временный фильтр Options::setupDefaultFilter
description: Метод Options::setupDefaultFilter записывает значения в пресет tmp_filter, делает его текущим и сохраняет настройки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setupDefaultFilter` применяет значения как временный фильтр. Метод записывает значения в пресет `tmp_filter`, делает его текущим и сохраняет настройки методом [save](save.md). Метод нужен, например, чтобы открыть страницу списка сразу с отбором по ссылке из другого раздела.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setupDefaultFilter(array $fields, array $rows)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fields\* | `array` | Задает значения полей — массив `ключ => значение` |
| rows\* | `array` | Задает коды полей, которые покажет фильтр |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код применяет отбор по названию и читает фильтр:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setupDefaultFilter(['NAME' => 'kg'], ['NAME']);

$filter = $options->getFilter([['id' => 'NAME']]);

echo $filter['PRESET_ID'] . ' ' . $filter['NAME'];
$options->destroy();
```

Код выведет `tmp_filter kg`.

## Смотрите также

- [Options::setFilterSettings](set-filter-settings.md)
- [Options::getFilter](get-filter.md)
