---
title: Построить цепочки дерева условий Query::setFilterHandlerChains
description: Служебный метод Query::setFilterHandlerChains строит цепочки полей дерева условий и регистрирует их в разделе запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setFilterHandlerChains` строит цепочки полей дерева условий [ConditionTree](../filter/condition-tree/index.md) и регистрирует их в разделе запроса. Метод добавляет поля-объекты из условий как поля запроса. Запрос вызывает метод сам, когда строит SQL. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setFilterHandlerChains(Filter $where, $section = 'filter')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| where\* | `Bitrix\Main\ORM\Query\Filter\ConditionTree` | Задает дерево условий |
| section | `string` | Задает раздел — `filter`, `where` или `having`. По умолчанию — `'filter'` |

Тип `section` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код строит цепочки дерева условий и выводит их:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();
$query->setFilterHandlerChains(Query::filter()->where('ACTIVE', 'Y')->whereLike('NAME', 'Rus%'));

echo implode(',', array_keys($query->getFilterChains()));
```

Код выведет `ACTIVE,NAME`.

## Смотрите также

- [Query::setFilterChains](set-filter-chains.md)
- [ConditionTree](../filter/condition-tree/index.md)
