---
title: Получить длину значения в SQL SqlHelper::getLengthFunction
description: Метод SqlHelper::getLengthFunction возвращает SQL-выражение длины колонки или выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getLengthFunction` возвращает SQL-выражение длины колонки или выражения. Аналог в классическом API — `CDatabase::Length`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getLengthFunction($field);
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
| `MysqliSqlHelper` | `LENGTH(<field>)` |
| `PgsqlSqlHelper` | `OCTET_LENGTH(<field>)` |

## Примеры

**Пример.** Код выводит длину самого длинного логина:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT MAX(' . $helper->getLengthFunction('LOGIN') . ') FROM ' . $helper->quote(UserTable::getTableName())
);
```

## Смотрите также

- [SqlHelper::getSubstrFunction](get-substr-function.md)
