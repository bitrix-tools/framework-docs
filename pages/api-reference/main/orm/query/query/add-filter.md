---
title: Добавить условие в фильтр-массив Query::addFilter
description: Метод Query::addFilter добавляет условие или группу условий в фильтр-массив запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::addFilter` добавляет условие в фильтр-массив. Чтобы добавить группу условий, передайте `null` и массив группы.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function addFilter($key, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| key\* | `string` или `null` | Задает поле с оператором, например `>SORT`. Значение `null` с массивом в `value` добавляет группу условий |
| value\* | `mixed` | Задает значение условия или массив группы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

Условие с тем же ключом заменяет прежнее.

## Примеры

**Пример.** Код добавляет условие и группу условий:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()
    ->addFilter('=ACTIVE', 'Y')
    ->addFilter(null, ['LOGIC' => 'OR', '=LID' => 'ru', '=LID ' => 'en']);

echo json_encode($query->getFilter());
```

Код выведет `{"=ACTIVE":"Y","0":{"LOGIC":"OR","=LID":"ru","=LID ":"en"}}`.

## Смотрите также

- [Query::setFilter](set-filter.md)
