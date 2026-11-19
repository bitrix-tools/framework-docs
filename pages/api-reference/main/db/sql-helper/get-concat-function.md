---
title: Склеить строки в SQL SqlHelper::getConcatFunction
description: Метод SqlHelper::getConcatFunction возвращает SQL-выражение, которое склеивает колонки и выражения в одну строку.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getConcatFunction` возвращает SQL-выражение, которое склеивает колонки и выражения в одну строку. Аналог в классическом API — `CDatabase::Concat`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getConcatFunction();
```

Метод читает аргументы через `func_get_args()`, поэтому в сигнатуре параметров нет.

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| ...fields | `string` | Задают колонки или SQL-выражения, каждое отдельным аргументом. Строковые значения передавайте экранированными и в кавычках. Метод подставляет аргументы в SQL без экранирования |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `CONCAT(<a>, <b>, ...)`. Без аргументов — пустая строка |
| `PgsqlSqlHelper` | `<a> \|\| <b> \|\| ...`. Без аргументов — пустая строка |

## Примеры

**Пример.** Код выбирает имя и фамилию пользователя одной колонкой:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT ' . $helper->getConcatFunction('NAME', "' '", 'LAST_NAME')
    . ' FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID'
);
```

## Смотрите также

- [SqlHelper::getIsNullFunction](get-is-null-function.md)
- [SqlHelper::getSubstrFunction](get-substr-function.md)
