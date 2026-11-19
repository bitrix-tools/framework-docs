---
title: Получить условия для выборки Options::getFilterLogic
description: Метод Options::getFilterLogic превращает значения фильтра в условия для getList, например >WEIGHT для числа больше значения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getFilterLogic` превращает значения фильтра в условия для выборки. Метод вызывает [getFilter](get-filter.md) и переводит значения по типам полей. Например, число «больше 10» станет условием `>WEIGHT`, период дат — условиями `>=` и `<=`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getFilterLogic($sourceFields = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| sourceFields | `array` | Задает описание полей фильтра — тот же массив, что параметр `FILTER` компонента. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив условий в формате фильтра `getList`. Если фильтр не применен, метод возвращает пустой массив.

## Особенности

- Метод строит условия по описанию полей из `sourceFields`. Если там есть поле типа `date` или `number`, метод построит условия для всех полей этого типа в значениях, даже тех, которых нет в `sourceFields`.
- Метод не переносит строку поиска `FIND`.
- Ключ `strict` в описании поля метод не учитывает.

## Примеры

**Пример.** Код получает условие для числового поля:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$fields = [['id' => 'WEIGHT', 'type' => 'number']];
$options = new Options('units_filter', [
    'heavy' => ['name' => 'Heavy', 'default' => true, 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10', 'WEIGHT_to' => '']],
]);

echo json_encode($options->getFilterLogic($fields));
```

Код выведет `{">WEIGHT":"10"}`.

## Смотрите также

- [Options::getFilter](get-filter.md)
- [Фильтр main.ui.filter](../../../../../ui/main-ui-filter.md)
