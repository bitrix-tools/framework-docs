---
title: Получить значения фильтра Options::getFilter
description: Метод Options::getFilter возвращает значения текущего пресета фильтра main.ui.filter вместе со строкой поиска.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getFilter` возвращает значения, которые пользователь выбрал в фильтре, — значения текущего пресета, дополнительные поля и строку поиска. Метод нужен серверному коду страницы, чтобы построить условия выборки.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getFilter($sourceFields = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| sourceFields | `array` | Задает описание полей фильтра — тот же массив, что параметр `FILTER` компонента. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив значений полей. Ключи — коды полей и служебные ключи, например `WEIGHT_from`, `WEIGHT_to`, `CREATED_datesel`. Если фильтр применен, метод добавляет ключи.

| Ключ | Значение |
| --- | --- |
| `PRESET_ID`, `FILTER_ID` | Код текущего пресета |
| `FILTER_APPLIED` | `true` |
| `FIND` | Строка поиска |

Для пустого пресета `default_filter` метод возвращает пустой массив.

## Особенности

- Для полей даты метод вычисляет границы периода `_from` и `_to` по выбранному типу, например «Текущий месяц».
- Метод превращает ключ `<поле>_isEmpty` в `<поле>` = `false`, а ключ `<поле>_hasAnyValue` — в `!<поле>` = `false`.
- Если адрес страницы содержит `apply_filter` и это не AJAX-запрос, метод записывает значения из адреса в пресет `tmp_filter` и сохраняет настройки методом [save](save.md). Текущим пресет станет, только если `apply_filter` = `Y`. С параметром `clear_filter=Y` метод применяет пустой пресет `default_filter`.
- Готовые условия для выборки возвращает [getFilterLogic](get-filter-logic.md).

## Примеры

**Пример.** Код читает значения закрепленного пресета:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$fields = [
    ['id' => 'NAME', 'default' => true],
    ['id' => 'ACTIVE', 'type' => 'list'],
];
$options = new Options('units_filter', ['active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']]]);

echo json_encode($options->getFilter($fields));
```

Код выведет `{"ACTIVE":"Y","PRESET_ID":"active","FILTER_ID":"active","FILTER_APPLIED":true,"FIND":""}`.

## Смотрите также

- [Фильтр main.ui.filter](../../../../../ui/main-ui-filter.md)
- [Options::getFilterLogic](get-filter-logic.md)
