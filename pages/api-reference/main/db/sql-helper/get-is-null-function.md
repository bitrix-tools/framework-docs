---
title: Заменить NULL в SQL SqlHelper::getIsNullFunction
description: Метод SqlHelper::getIsNullFunction возвращает SQL-выражение, которое заменяет NULL другим значением.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getIsNullFunction` возвращает SQL-выражение, которое возвращает `result`, если `expression` равно `NULL`, и `expression` в остальных случаях. Аналог в классическом API — `CDatabase::IsNull`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getIsNullFunction($expression, $result);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| expression\* | `string` | Задает колонку или SQL-выражение для проверки. Метод подставляет значение в SQL без экранирования |
| result\* | `string` | Задает колонку или SQL-выражение для замены `NULL`. Метод подставляет значение в SQL без экранирования |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `IFNULL(<expression>, <result>)` |
| `PgsqlSqlHelper` | `COALESCE(<expression>, <result>)` |

## Примеры

**Пример.** Код выводит дату последнего входа, а для пользователей без входа — дату регистрации:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$result = $connection->query(
    'SELECT LOGIN, ' . $helper->getIsNullFunction('LAST_LOGIN', 'DATE_REGISTER') . ' AS SEEN'
    . ' FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID',
    3
);

while ($row = $result->fetch())
{
    echo $row['LOGIN'] . ' ' . $row['SEEN'] . PHP_EOL;
}
```

## Смотрите также

- [SqlHelper::getConcatFunction](get-concat-function.md)
