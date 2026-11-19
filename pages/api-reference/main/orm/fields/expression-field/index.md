---
title: ExpressionField — поле-выражение ORM
description: Класс Bitrix\Main\ORM\Fields\ExpressionField описывает поле, значение которого вычисляет SQL-выражение над другими полями, например COUNT или сумма колонок.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Fields`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.0

{% endnote %}

## Когда использовать

Поле `ExpressionField` вычисляет значение SQL-выражением, например `COUNT(*)`, `LENGTH(%s)` или `%s * %s`. Поле нужно для агрегатов, вычисляемых колонок и условий фильтра по выражению. Поле не хранится в таблице и доступно только для чтения.

Поле описывают в параметре `runtime` запроса `getList` или в методе `getMap` таблицы. Конструктор принимает имя поля, выражение и список полей, которые ORM подставляет в выражение вместо `%s`.

```php
new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME');
new ExpressionField('CNT', 'COUNT(*)');
new ExpressionField('TOTAL', '%s * %s', ['PRICE', 'QUANTITY']);
```

Метод [configureValueType](configure-value-type.md) задает тип значения. По умолчанию тип — `StringField`.

Если выражение содержит агрегатную функцию, ORM сама группирует выборку по остальным полям `select`, `order` и условий `HAVING`. Такую выборку нельзя прочитать объектами через `fetchObject`.

Запрос регистрирует копию поля из `runtime`. Вызовы `configure*` у исходного объекта после регистрации на запрос не влияют.

Старое имя класса `Bitrix\Main\Entity\ExpressionField` работает как псевдоним.

Подробнее — в статьях [Выборка данных](../../../../../orm/querying-data.md) и [Построитель запросов](../../../../../orm/query-builder.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [configureValueType](configure-value-type.md) | Задает класс поля, которое описывает тип значения | |
| [configureValueField](configure-value-field.md) | Задает объект поля, которое описывает тип значения | |
| [getValueType](get-value-type.md) | Возвращает класс поля типа значения | |
| [getValueField](get-value-field.md) | Возвращает объект поля типа значения | |
| [getExpression](get-expression.md) | Возвращает выражение в исходном виде | |
| [getBuildFrom](get-build-from.md) | Возвращает поля, которые ORM подставляет в выражение | |
| [getBuildFromChains](get-build-from-chains.md) | Возвращает цепочки полей выражения | |
| [getFullExpression](get-full-expression.md) | Возвращает выражение с раскрытыми вложенными выражениями | |
| [isAggregated](is-aggregated.md) | Проверяет, есть ли в выражении агрегатная функция | |
| [hasSubquery](has-subquery.md) | Проверяет, есть ли в выражении подзапрос | |
| [isConstant](is-constant.md) | Проверяет, что выражение не зависит от полей | |
| [checkAggregation](check-aggregation.md) | Находит агрегатные функции в строке выражения | |
| [checkSubquery](check-subquery.md) | Проверяет, есть ли подзапрос в строке выражения | |
| [removeSubqueries](remove-subqueries.md) | Удаляет из строки выражения подзапросы и строковые литералы | |
| [cast](cast.md) | Приводит значение к типу поля | |
| [convertValueFromDb](convert-value-from-db.md) | Преобразует значение из базы данных | |
| [convertValueToDb](convert-value-to-db.md) | Преобразует значение для базы данных | |

## Наследование

Класс наследует `Bitrix\Main\ORM\Fields\Field` и реализует `IReadable`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct($name, $expression, $buildFrom = null, $parameters = [])` | Принимает выражение и поля для подстановки. `buildFrom` — строка, массив строк или функций, которые возвращают `SqlExpression`. Без параметра `data_type` задает тип значения `StringField`. Параметр `parameters` — старый формат настроек, для нового кода используйте методы `configure*` |
| `setEntity` | Создает поле типа значения по [configureValueType](configure-value-type.md) или берет объект из [configureValueField](configure-value-field.md). При старом формате с параметром `data_type` создает поле через `Entity::initializeField`. Выбрасывает `Bitrix\Main\SystemException`, если тип значения — не скалярное поле |
| `getTypeMask` | Возвращает `FieldTypeMask::EXPRESSION` |
| `getDataType` | Устарел. Возвращает тип данных поля типа значения |
| `validateValue` | Выбрасывает `Bitrix\Main\NotImplementedException`, потому что значение поля-выражения нельзя записать |
| `__clone` | Сбрасывает запомненные цепочки и полное выражение у копии |

### Вызов методов поля типа значения

Методы, которых нет в `ExpressionField` и `Field`, поле передает полю типа значения. Например, `getColumnName` вернет имя колонки поля типа значения. Методы `Field`, например `getTitle`, отвечают от самого выражения. До привязки к сущности такой вызов завершится ошибкой PHP.

## Смотрите также

- [Выборка данных](../../../../../orm/querying-data.md)
- [Result](../../query/result/index.md)
- [DatetimeField](../datetime-field/index.md)
