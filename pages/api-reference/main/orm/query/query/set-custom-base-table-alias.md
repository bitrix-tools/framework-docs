---
title: Задать псевдоним основной таблицы Query::setCustomBaseTableAlias
description: Метод Query::setCustomBaseTableAlias задает свой псевдоним основной таблицы запроса вместо псевдонима по коду сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.10

{% endnote %}

Метод `Query::setCustomBaseTableAlias` задает свой псевдоним основной таблицы. По умолчанию псевдоним — код сущности строчными буквами, например `main_localization_language`. Метод нужен, когда SQL запроса вставляют в другой запрос с известным псевдонимом.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setCustomBaseTableAlias($alias)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| alias\* | `string` | Задает псевдоним |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

Метод заменяет псевдоним целиком. Запрос не добавляет к нему суффикс из [setTableAliasPostfix](set-table-alias-postfix.md).

## Примеры

**Пример.** Код задает псевдоним `L` и получает SQL:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::query()->setSelect(['LID'])->setCustomBaseTableAlias('L')->getQuery();
```

Код выведет:

```text
SELECT 
	`L`.`LID` AS `LID`
FROM `b_language` `L` 
```

## Смотрите также

- [Query::getInitAlias](get-init-alias.md)
- [Query::buildFilterSql](build-filter-sql.md)
