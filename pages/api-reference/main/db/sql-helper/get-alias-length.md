---
title: Получить длину псевдонима SqlHelper::getAliasLength
description: Метод SqlHelper::getAliasLength возвращает наибольшую длину псевдонима колонки в запросе SELECT.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `SqlHelper::getAliasLength` возвращает наибольшую длину псевдонима колонки в запросе `SELECT`, которую допускает база данных. ORM сравнивает с ней длину псевдонимов и заменяет слишком длинные псевдонимы короткими.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getAliasLength();
```

## Возвращаемое значение

Метод возвращает целое число `int`.

| Реализация | Значение |
| --- | --- |
| `MysqliSqlHelper` | `256` |
| `PgsqlSqlHelper` | `63` |

## Примеры

**Пример.** Код проверяет, поместится ли псевдоним в ограничение базы данных:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$alias = 'UNIT_MEASURE_DISPLAY_TITLE';

var_dump(mb_strlen($alias) <= Application::getConnection()->getSqlHelper()->getAliasLength());
```

## Смотрите также

- [Result::setReplacedAliases](../result/set-replaced-aliases.md)
