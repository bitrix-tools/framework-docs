---
title: Сравнить поле с другим полем ConditionTree::whereColumn
description: Метод ConditionTree::whereColumn добавляет условие, в котором значение — другое поле, а не константа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereColumn` сравнивает поле с другим полем. Метод работает как [where](where.md), но считает значение именем поля. Метод нужен, например, чтобы найти записи, где дата изменения больше даты создания, или сравнить поле связанной таблицы с полем основной.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereColumn(...$filter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter\* | `string` | Задает поле, оператор и второе поле, например `('TIMESTAMP_X', '>', 'DATE_REGISTER')`. Без оператора метод сравнивает через `=` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Аргументов не два и не три или оператор неизвестен |

## Примеры

**Пример.** Код выбирает языки, у которых сортировка совпадает с идентификатором культуры:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereColumn('SORT', 'CULTURE_ID'),
    'order' => ['LID' => 'ASC'],
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

На сайте с языками по умолчанию код выведет `en,ru`.

## Смотрите также

- [ConditionTree::where](where.md)
