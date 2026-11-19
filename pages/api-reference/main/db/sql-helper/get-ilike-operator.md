---
title: Сравнить по шаблону без учета регистра SqlHelper::getIlikeOperator
description: Метод SqlHelper::getIlikeOperator возвращает SQL-условие LIKE без учета регистра для типа базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getIlikeOperator` возвращает SQL-условие, которое сравнивает колонку с шаблоном `LIKE` без учета регистра.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getIlikeOperator($field, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает колонку или SQL-выражение. Метод подставляет значение в SQL без экранирования |
| value\* | `string` | Задает шаблон в кавычках, например результат [convertToDbString](convert-to-db-string.md). Метод подставляет значение в SQL без экранирования |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-условие.

| Реализация | Условие |
| --- | --- |
| `MysqliSqlHelper` | `<field> LIKE <value>`. Метод строит обычный `LIKE` и не отключает учет регистра отдельно |
| `PgsqlSqlHelper` | `<field> ILIKE <value>` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код считает пользователей, логин которых начинается с `adm`:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT COUNT(*) FROM ' . $helper->quote(UserTable::getTableName())
    . ' WHERE ' . $helper->getIlikeOperator('LOGIN', $helper->convertToDbString('ADM%'))
);
```

## Смотрите также

- [SqlHelper::getRegexpOperator](get-regexp-operator.md)
