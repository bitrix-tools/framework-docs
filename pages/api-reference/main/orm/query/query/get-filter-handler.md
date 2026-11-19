---
title: Получить дерево условий Query::getFilterHandler
description: Метод Query::getFilterHandler возвращает дерево условий запроса, в которое пишут методы where и having.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getFilterHandler` возвращает дерево условий запроса — объект [ConditionTree](../filter/condition-tree/index.md). Методы `where*` и `having*` запроса добавляют условия в это дерево.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getFilterHandler()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Query\Filter\ConditionTree`.

## Особенности

Методы `having*` пишут в то же дерево, что и `where*`. Запрос сам решает при построении SQL, какие условия пойдут в `HAVING` — те, что содержат агрегатные функции.

## Примеры

**Пример.** Код добавляет два условия и считает их в дереве:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->where('ACTIVE', 'Y')->whereIn('LID', ['ru', 'en']);

echo count($query->getFilterHandler()->getConditions());
```

Код выведет `2`.

## Смотрите также

- [ConditionTree](../filter/condition-tree/index.md)
- [Query::filter](filter.md)
