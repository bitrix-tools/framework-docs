---
title: Получить номер строки в SQL SqlHelper::getRowNumber
description: Метод SqlHelper::getRowNumber возвращает SQL-выражение номера строки в результате запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getRowNumber` возвращает SQL-выражение номера строки в результате запроса. Перед запросом выполните запрос из [initRowNumber](init-row-number.md), если он не пустой.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getRowNumber($variableName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| variableName\* | `string` | Задает имя переменной счетчика — то же, что в `initRowNumber`. Метод подставляет значение в SQL без экранирования |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-выражение.

| Реализация | Выражение |
| --- | --- |
| `MysqliSqlHelper` | `@<variableName>:=@<variableName> + 1` |
| `PgsqlSqlHelper` | `row_number() over()`. Метод не использует имя переменной |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код выводит выражение номера строки:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->getRowNumber('rn');
```

Полный пример — на странице [initRowNumber](init-row-number.md).

## Смотрите также

- [SqlHelper::initRowNumber](init-row-number.md)
