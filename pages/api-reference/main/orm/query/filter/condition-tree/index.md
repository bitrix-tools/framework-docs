---
title: ConditionTree — дерево условий фильтра ORM
description: Класс Bitrix\Main\ORM\Query\Filter\ConditionTree хранит условия фильтра ORM, объединяет их через AND или OR и строит из них SQL.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Query\Filter`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 17.5.1

{% endnote %}

## Когда использовать

Класс `ConditionTree` хранит условия фильтра ORM — сравнения, `IN`, `BETWEEN`, `LIKE`, подзапросы. Дерево объединяет условия через `AND` или `OR` и может содержать вложенные деревья. Так собирают фильтры вида `A AND (B OR C)`.

Объект фильтра создает метод `Query::filter()`. Готовый фильтр передают в метод `where` запроса, в параметр `filter` метода [getList](../../../data/data-manager/get-list.md) или в метод [getCount](../../../data/data-manager/get-count.md).

```php
use Bitrix\Main\ORM\Query\Query;

$filter = Query::filter()
    ->logic('or')
    ->where('ACTIVE', true)
    ->whereIn('LID', ['en', 'ru']);
```

Запрос `Query` принимает те же вызовы `where*` и передает их своему дереву условий, но возвращает сам запрос. Вызовы `having*` запроса работают так же и пишут в то же дерево. В `HAVING` условие попадает, только если содержит агрегатную функцию.

Старое имя класса `Bitrix\Main\Entity\Query\Filter\ConditionTree` работает как псевдоним.

Подробнее — в статье [Построитель запросов](../../../../../../orm/query-builder.md).

## Методы класса

### Условия

| Метод | Описание | С версии |
| --- | --- | --- |
| [where](where.md) | Добавляет условие сравнения или вложенный фильтр | |
| [whereNot](where-not.md) | Добавляет условие с отрицанием `NOT` | |
| [whereColumn](where-column.md) | Сравнивает поле с другим полем | |
| [whereNull](where-null.md) | Проверяет поле на `NULL` | |
| [whereNotNull](where-not-null.md) | Проверяет поле на `NOT NULL` | |
| [whereIn](where-in.md) | Проверяет поле на вхождение в список `IN` | |
| [whereNotIn](where-not-in.md) | Проверяет поле на отсутствие в списке `NOT IN` | |
| [whereBetween](where-between.md) | Проверяет поле на диапазон `BETWEEN` | |
| [whereNotBetween](where-not-between.md) | Проверяет поле на выход за диапазон `NOT BETWEEN` | |
| [whereLike](where-like.md) | Сравнивает поле с шаблоном `LIKE` | |
| [whereNotLike](where-not-like.md) | Проверяет поле на несовпадение с шаблоном `NOT LIKE` | |
| [whereExists](where-exists.md) | Добавляет условие `EXISTS` с подзапросом | |
| [whereNotExists](where-not-exists.md) | Добавляет условие `NOT EXISTS` | |
| [whereMatch](where-match.md) | Добавляет полнотекстовый поиск `MATCH` | 17.5.5 |
| [whereNotMatch](where-not-match.md) | Добавляет полнотекстовый поиск с отрицанием | 17.5.5 |
| [whereExpr](where-expr.md) | Добавляет условие из SQL-выражения | |

### Логика и состав дерева

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает пустое дерево с логикой `AND` | |
| [createFromArray](create-from-array.md) | Создает дерево из массива | |
| [logic](logic.md) | Задает или возвращает логику объединения условий | |
| [negative](negative.md) | Ставит `NOT` перед всеми условиями дерева | |
| [getConditions](get-conditions.md) | Возвращает условия и вложенные деревья | |
| [hasConditions](has-conditions.md) | Проверяет, есть ли условия | |
| [addCondition](add-condition.md) | Добавляет готовое условие | |
| [replaceCondition](replace-condition.md) | Заменяет условие | |
| [removeCondition](remove-condition.md) | Удаляет условие | |
| [removeAllConditions](remove-all-conditions.md) | Удаляет все условия | |
| [getSql](get-sql.md) | Строит SQL условий | |

## Операторы

Метод [where](where.md) принимает операторы `=`, `<>`, `!=`, `<`, `<=`, `>`, `>=`, `in`, `between`, `like`, `exists`, `match` и `expr`. Буквенные операторы пишите строчными, например `'in'`, иначе метод выбросит исключение.

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `LOGIC_AND` | `'and'` | Объединение условий через `AND` |
| `LOGIC_OR` | `'or'` | Объединение условий через `OR` |

## Смотрите также

- [Построитель запросов](../../../../../../orm/query-builder.md)
- [DataManager::getList](../../../data/data-manager/get-list.md)
- [ExpressionField](../../../fields/expression-field/index.md)
