---
title: Привести значение к строке SqlHelper::castToChar
description: Метод SqlHelper::castToChar возвращает SQL-выражение CAST, которое приводит колонку или выражение к строке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.0.10

{% endnote %}

Метод `SqlHelper::castToChar` возвращает выражение `CAST`, которое приводит колонку или выражение к строковому типу.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function castToChar($fieldName);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fieldName\* | `string` | Задает колонку или SQL-выражение. Метод подставляет значение в SQL без экранирования |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `CAST(<fieldName> AS char)` |
| `PgsqlSqlHelper` | `CAST(<fieldName> AS varchar)` |

## Примеры

**Пример.** Код склеивает идентификатор и логин. Метод `castToChar` приводит идентификатор к строке:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT ' . $helper->getConcatFunction($helper->castToChar('ID'), "':'", 'LOGIN')
    . ' FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID'
);
```

## Смотрите также

- [SqlHelper::softCastTextToChar](soft-cast-text-to-char.md)
