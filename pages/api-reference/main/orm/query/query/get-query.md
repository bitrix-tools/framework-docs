---
title: Получить SQL-запрос Query::getQuery
description: Метод Query::getQuery строит и возвращает текст SQL-запроса без выполнения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getQuery` строит и возвращает текст SQL-запроса, но не выполняет его. Метод нужен для отладки и для передачи SQL в другой запрос.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getQuery($forceObjectPrimary = false)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| forceObjectPrimary | `bool` | Значение `true` добавляет в выборку первичный ключ, как [exec](exec.md). По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку SQL.

## Особенности

Запрос строит части SQL один раз. После вызова изменения выборки, фильтра и сортировки не попадут в SQL.

## Примеры

**Пример.** Код получает SQL запроса:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::query()->setSelect(['LID'])->where('ACTIVE', 'Y')->getQuery();
```

Код выведет:

```text
SELECT 
	`main_localization_language`.`LID` AS `LID`
FROM `b_language` `main_localization_language` 

WHERE `main_localization_language`.`ACTIVE` = 'Y'
```

## Смотрите также

- [Query::getLastQuery](get-last-query.md)
- [Query::exec](exec.md)
