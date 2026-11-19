---
title: Подготовить нумерацию строк SqlHelper::initRowNumber
description: Метод SqlHelper::initRowNumber возвращает запрос, который подготавливает нумерацию строк для getRowNumber.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::initRowNumber` возвращает запрос, который нужно выполнить перед запросом с [getRowNumber](get-row-number.md).

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function initRowNumber($variableName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| variableName\* | `string` | Задает имя переменной счетчика. Метод подставляет значение в SQL без экранирования, используйте только латинские буквы, цифры и `_` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `MysqliSqlHelper` | `set @<variableName> = 0` |
| `PgsqlSqlHelper` | Пустая строка. Выполнять ничего не нужно |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код нумерует пользователей в результате запроса:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$init = $helper->initRowNumber('rn');
if ($init !== '')
{
    $connection->queryExecute($init);
}

$result = $connection->query(
    'SELECT LOGIN, ' . $helper->getRowNumber('rn') . ' AS NUM FROM ' . $helper->quote(UserTable::getTableName()),
    3
);

while ($row = $result->fetch())
{
    echo $row['NUM'] . ' ' . $row['LOGIN'] . PHP_EOL;
}
```

## Смотрите также

- [SqlHelper::getRowNumber](get-row-number.md)
