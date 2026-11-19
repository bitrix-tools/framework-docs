---
title: Получить значения полей из адреса Options::fetchSettingsFromQuery
description: Статический метод Options::fetchSettingsFromQuery получает значения полей фильтра из параметров запроса по описанию полей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::fetchSettingsFromQuery` получает значения полей фильтра из параметров запроса. Метод ищет в запросе параметры с кодами полей и служебными суффиксами по типу поля. [getFilter](get-filter.md) вызывает метод, когда [isSetFromRequest](is-set-from-request.md) вернул `true`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function fetchSettingsFromQuery($fields, HttpRequest $request)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fields\* | `array` | Задает описание полей — массив с ключами `id` и `type` |
| request\* | `Bitrix\Main\HttpRequest` | Задает запрос |

Тип в таблице описывает назначение аргумента `fields`. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив с двумя ключами. Ключ `fields` содержит значения полей, ключ `rows` — коды полей. Если запрос не содержит значений, метод возвращает `null`.

| Тип поля | Параметры запроса |
| --- | --- |
| `date` | `<поле>_datesel` и хотя бы один из `_from`, `_to`, `_year`, `_month`, `_quarter`, `_days`. В значения попадают все, кроме `_quarter` |
| `number` | `<поле>_numsel` и `_from` или непустой `_to` |
| `custom_entity` | `<поле>`. Подпись — `<поле>_name`, а если его нет — `<поле>_label` |
| `dest_selector`, `entity_selector` | `<поле>` и необязательная подпись `<поле>_label` |
| Другие | `<поле>` |
| Любой | `<поле>_isEmpty` и `<поле>_hasAnyValue` — отбор пустых и заполненных значений |

Метод передает параметр `FIND` как строку поиска.

## Примеры

**Пример.** Код получает значения из запроса:

```php
<?php
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Server;
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$request = new HttpRequest(new Server($_SERVER), [
    'apply_filter' => 'Y',
    'NAME' => 'kg',
    'WEIGHT_numsel' => 'more',
    'WEIGHT_from' => '10',
], [], [], []);
$fields = [['id' => 'NAME'], ['id' => 'WEIGHT', 'type' => 'number']];

echo json_encode(Options::fetchSettingsFromQuery($fields, $request));
```

Код выведет `{"fields":{"NAME":"kg","WEIGHT_numsel":"more","WEIGHT_from":"10","WEIGHT_to":""},"rows":["NAME","WEIGHT"]}`.

## Смотрите также

- [Options::isSetFromRequest](is-set-from-request.md)
