---
title: Проверить по регулярному выражению в SQL SqlHelper::getRegexpOperator
description: Метод SqlHelper::getRegexpOperator возвращает SQL-условие, которое проверяет значение по регулярному выражению.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getRegexpOperator` возвращает SQL-условие, которое проверяет колонку или выражение по регулярному выражению.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getRegexpOperator($field, $regexp)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает колонку или SQL-выражение. Метод подставляет значение в SQL без экранирования |
| regexp\* | `string` | Задает регулярное выражение в кавычках, например результат [convertToDbString](convert-to-db-string.md). Метод подставляет значение в SQL без экранирования |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-условие.

| Реализация | Условие |
| --- | --- |
| `MysqliSqlHelper` | `<field> regexp <regexp>` |
| `PgsqlSqlHelper` | `<field> ~ <regexp>` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код считает пользователей, логин которых состоит только из латинских букв:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT COUNT(*) FROM ' . $helper->quote(UserTable::getTableName())
    . ' WHERE ' . $helper->getRegexpOperator('LOGIN', $helper->convertToDbString('^[a-z]+$'))
);
```

## Смотрите также

- [SqlHelper::getIlikeOperator](get-ilike-operator.md)
