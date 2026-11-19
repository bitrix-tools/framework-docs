---
title: Добавить параметры запроса Uri::addParams
description: Метод Uri::addParams добавляет параметры в строку запроса или заменяет существующие и пересобирает строку запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.10

{% endnote %}

Метод `Uri::addParams` добавляет параметры в строку запроса. Если параметр уже есть, метод заменяет его значение. Метод меняет сам объект.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function addParams(array $params, $preserveDots = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| params\* | `array` | Задает параметры, например `['page' => 2]`. Метод записывает значение-массив как `name[0]=...&name[1]=...` |
| preserveDots | `bool` | Значение `true` сохраняет точки и пробелы в именах существующих параметров. По умолчанию — `false` |

Сигнатура PHP объявляет только тип `params`.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Особенности

- Метод разбирает строку запроса функцией `parse_str` и собирает заново функцией `http_build_query` в кодировке RFC 3986. Поэтому метод меняет запись всех параметров. Например, `+` в значениях становится `%20`, а скобки в именах — `%5B` и `%5D`.
- Без `preserveDots` функция `parse_str` заменяет точки и пробелы в именах существующих параметров на `_`. Например, `filter.name` станет `filter_name`. Если в адресе есть такие параметры, передайте `true`.

## Примеры

**Пример.** Код меняет номер страницы и добавляет сортировку:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('/units/list.php?filter.name=kg&page=2');

echo (clone $uri)->addParams(['page' => 3, 'sort' => 'name desc'])->getUri() . "\n";
echo (clone $uri)->addParams(['page' => 3], true)->getUri();
```

Код выведет:

```text
/units/list.php?filter_name=kg&page=3&sort=name%20desc
/units/list.php?filter.name=kg&page=3
```

## Смотрите также

- [Uri::deleteParams](delete-params.md)
- [Uri::getQuery](get-query.md)
