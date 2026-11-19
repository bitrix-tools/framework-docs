---
title: Задать соединение SqlExpression::setConnection
description: Метод SqlExpression::setConnection задает соединение, по правилам которого метод compile экранирует значения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlExpression::setConnection` задает соединение, по правилам которого метод [compile](compile.md) экранирует значения. Если метод не вызван, выражение использует соединение по умолчанию.

Задайте соединение, если запрос с выражением выполняет другое соединение. В MySQL и PostgreSQL отличаются кавычки идентификаторов и результат плейсхолдера `?v`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlExpression`:

```php
public function setConnection($connection)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| connection\* | `Bitrix\Main\DB\Connection`, `null` | Задает соединение, по правилам которого метод `compile` экранирует значения. Значение `null` сбрасывает соединение, и следующий вызов [getConnection](get-connection.md) вернет соединение по умолчанию |

Типы в таблице описывают назначение аргумента. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код проверяет, есть ли колонка в таблице. Выражение экранирует имена по правилам того же соединения, которое выполняет запрос. Для другой базы данных подставьте имя ее соединения.

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\SqlExpression;
use Bitrix\Main\DB\SqlQueryException;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

// Имя соединения из секции connections файла .settings.php
$connection = Application::getConnection('default');

$expression = new SqlExpression('SELECT ?# FROM ?# WHERE 1 = 0', 'LOGIN', UserTable::getTableName());
$expression->setConnection($connection);

try
{
    $connection->query($expression->compile());
    echo 'Column exists';
}
catch (SqlQueryException $exception)
{
    echo 'Column not found';
}
```

## Смотрите также

- [SqlExpression::getConnection](get-connection.md)
- [SqlExpression::compile](compile.md)
