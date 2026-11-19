---
title: Подготовить текстовую колонку для сортировки SqlHelper::softCastTextToChar
description: Метод SqlHelper::softCastTextToChar возвращает выражение текстовой колонки для GROUP BY и ORDER BY.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.7

{% endnote %}

Метод `SqlHelper::softCastTextToChar` возвращает выражение текстовой колонки для группировки и сортировки. ORM вызывает метод, когда строит `GROUP BY` и `ORDER BY` по текстовому полю, но только для соединений с Oracle и MS SQL. Для MySQL и PostgreSQL ORM метод не вызывает.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function softCastTextToChar($fieldName);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fieldName\* | `string` | Задает колонку или SQL-выражение. Метод подставляет значение в SQL без экранирования |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string`. Реализации `MysqliSqlHelper` и `PgsqlSqlHelper` возвращают `fieldName` без изменений.

## Примеры

**Пример.** Код выводит выражение для колонки:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->softCastTextToChar('NOTE');
```

## Смотрите также

- [SqlHelper::castToChar](cast-to-char.md)
