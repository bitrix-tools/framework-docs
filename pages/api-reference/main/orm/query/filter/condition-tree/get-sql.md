---
title: Построить SQL условий ConditionTree::getSql
description: Метод ConditionTree::getSql строит SQL-условие из дерева по цепочкам полей запроса. Запрос вызывает метод сам.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::getSql` строит SQL-условие из дерева, без слова `WHERE`. Метод использует цепочки полей, которые построил запрос `Query`, поэтому запрос вызывает его сам. Метод редко нужен прикладному коду. Чтобы посмотреть SQL запроса целиком, используйте метод `getQuery` запроса.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function getSql($chains)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| chains\* | `Bitrix\Main\ORM\Query\Chain[]` | Задает цепочки полей в виде `имя поля => цепочка`, например результат метода `getFilterChains` запроса после `getQuery` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку SQL. Метод возвращает `null`, если в дереве нет условий или ни одно условие не дало SQL, например в дереве только пустые вложенные деревья.

## Особенности

Если для поля нет цепочки, метод вызовет ошибку PHP. Передавайте цепочки запроса, который уже построил SQL с этими полями.

## Примеры

**Пример.** Код строит SQL фильтра по цепочкам запроса:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID'])->where('LID', 'en');
$query->getQuery();

$filter = Query::filter()->where('LID', 'en');

echo $filter->getSql($query->getFilterChains());
```

На сайте с MySQL код выведет `` `main_localization_language`.`LID` = 'en' ``.

## Смотрите также

- [ConditionTree::where](where.md)
