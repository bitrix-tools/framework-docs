---
title: Добавить условие ConditionTree::where
description: Метод ConditionTree::where добавляет в фильтр условие сравнения поля, вложенный фильтр или набор условий массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::where` добавляет условие в фильтр. Метод принимает аргументы в нескольких формах.

- `where('SORT', '>', 100)` — поле, оператор и значение.
- `where('LID', 'en')` — поле и значение, оператор `=`.
- `where('ACTIVE')` — только поле. Подходит для поля `BooleanField`, поле сравнивается с `true`.
- `where($subFilter)` — вложенный фильтр `ConditionTree`, добавляется как одно условие.
- `where([['LID', 'en'], ['SORT', '>', 1]])` — массив условий, `where` вызывается для каждого элемента.

Вместо имени поля можно передать поле-выражение [ExpressionField](../../../fields/expression-field/index.md) или результат `Query::expr()`, например `Query::expr()->length('NAME')`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function where(...$filter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter\* | `mixed` | Задает условие в одной из форм выше. Значение может быть числом, строкой, датой, объектом `SqlExpression` или подзапросом `Query` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Оператор неизвестен, например `IN` заглавными буквами, или аргументов нет либо больше трех |

## Особенности

- Метод проверяет только оператор. Запрос проверяет поле, когда строит SQL. Если поля нет в описании сущности, запрос выбросит `ArgumentException` при построении SQL.
- Значение сохраняется как есть. Запрос приводит его к типу поля при построении SQL. Для `BooleanField` значение `true` станет истинным значением поля, например `'Y'` для значений `['N', 'Y']`.

## Примеры

**Пример.** Код выбирает активные языки с сортировкой больше 1:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()
    ->where('ACTIVE', true)
    ->where('SORT', '>', 1);

$rows = LanguageTable::getList(['select' => ['LID'], 'filter' => $filter])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en`.

## Смотрите также

- [ConditionTree::whereNot](where-not.md)
- [ConditionTree::logic](logic.md)
