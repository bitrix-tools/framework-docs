---
title: Удалить параметры запроса Uri::deleteParams
description: Метод Uri::deleteParams удаляет параметры из строки запроса по именам и пересобирает строку запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.10

{% endnote %}

Метод `Uri::deleteParams` удаляет параметры из строки запроса по именам. Метод меняет сам объект.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function deleteParams(array $params, $preserveDots = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| params\* | `string[]` | Задает имена параметров, например `['page', 'sort']`. Если параметра нет в адресе, метод его пропускает |
| preserveDots | `bool` | Значение `true` сохраняет точки и пробелы в именах параметров. По умолчанию — `false` |

Сигнатура PHP объявляет только тип `params`.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Особенности

- Без `preserveDots` функция `parse_str` заменяет точки и пробелы в именах на `_`. Тогда метод не найдет параметр `filter.name` и перепишет остальные имена с точками. Для таких имен передайте `true`.
- Метод собирает строку запроса заново, как [addParams](add-params.md).

## Примеры

**Пример.** Код удаляет параметр с точкой в имени:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('/units/list.php?filter.name=kg&page=2');

echo (clone $uri)->deleteParams(['filter.name'])->getUri() . "\n";
echo (clone $uri)->deleteParams(['filter.name'], true)->getUri();
```

Код выведет:

```text
/units/list.php?filter_name=kg&page=2
/units/list.php?page=2
```

## Смотрите также

- [Uri::addParams](add-params.md)
