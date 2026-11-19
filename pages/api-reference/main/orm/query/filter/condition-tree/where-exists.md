---
title: Добавить условие EXISTS ConditionTree::whereExists
description: Метод ConditionTree::whereExists добавляет условие EXISTS с подзапросом Query или SQL-выражением.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereExists` добавляет условие `EXISTS` — подзапрос возвращает хотя бы одну строку. Подзапрос задают объектом `Query` или SQL-выражением `SqlExpression`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereExists($query)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| query\* | `Bitrix\Main\ORM\Query\Query` или `Bitrix\Main\DB\SqlExpression` | Задает подзапрос |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

- Метод не проверяет тип аргумента, в отличие от [whereNotExists](where-not-exists.md). Если передать строку, при построении SQL возникнет ошибка PHP `Error`.
- Чтобы связать подзапрос с основной таблицей, сравните поле подзапроса с колонкой основной таблицы. Заполнитель `?#` в `SqlExpression` экранирует имя колонки из аргумента. Например, `'main_user.ID'` превращается в `` `main_user`.`ID` ``.
- ORM строит псевдоним основной таблицы из пространства имен класса без `Bitrix` и имени сущности в нижнем регистре: `UserTable` — `main_user`, `LanguageTable` — `main_localization_language`.

## Примеры

**Пример.** Код считает пользователей, у которых есть хотя бы одна группа:

```php
<?php
use Bitrix\Main\DB\SqlExpression;
use Bitrix\Main\ORM\Query\Query;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()->whereExists(
    new SqlExpression('SELECT 1 FROM b_user_group UG WHERE UG.USER_ID = ?#', 'main_user.ID')
);

echo UserTable::getCount($filter) > 0 ? 'users with groups' : 'no users';
```

Код выведет `users with groups`.

## Смотрите также

- [ConditionTree::whereNotExists](where-not-exists.md)
- [ConditionTree::whereIn](where-in.md)
