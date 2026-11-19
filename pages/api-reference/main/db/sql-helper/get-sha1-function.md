---
title: Получить функцию SHA-1 SqlHelper::getSha1Function
description: Метод SqlHelper::getSha1Function возвращает SQL-выражение хеша SHA-1 от колонки или выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getSha1Function` возвращает SQL-выражение хеша SHA-1 от колонки или выражения. Метод [getConditionalAssignment](get-conditional-assignment.md) использует его, чтобы сравнить значения по хешу.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getSha1Function($field)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает колонку или SQL-выражение. Метод подставляет значение в SQL без экранирования |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `SqlHelper`, `MysqliSqlHelper` | `sha1(<field>)` |
| `PgsqlSqlHelper` | `encode(digest(replace(<field>, '\', '\\')::bytea, 'sha1'), 'hex')` |

## Примеры

**Пример.** Код сравнивает хеш логина из базы данных с хешем PHP:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$row =
    $connection
        ->query(
            'SELECT LOGIN, ' . $helper->getSha1Function('LOGIN') . ' AS HASH'
            . ' FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID',
            1
        )
        ->fetch()
;

var_dump($row['HASH'] === sha1($row['LOGIN']));
```

## Смотрите также

- [SqlHelper::getConditionalAssignment](get-conditional-assignment.md)
