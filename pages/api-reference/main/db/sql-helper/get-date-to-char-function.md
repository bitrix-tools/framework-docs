---
title: Превратить дату в строку SqlHelper::getDateToCharFunction
description: Метод SqlHelper::getDateToCharFunction возвращает SQL-выражение, которое переводит дату в строку YYYY-MM-DD HH:MI:SS.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `SqlHelper::getDateToCharFunction` возвращает SQL-выражение, которое переводит колонку с датой в строку формата `YYYY-MM-DD HH:MI:SS`. Метод классического API `CDatabase::DateToCharFunction` с похожим именем работает иначе и переводит дату в формат сайта.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getDateToCharFunction($fieldName);
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
| `MysqliSqlHelper` | `<fieldName>` без изменений |
| `PgsqlSqlHelper` | `TO_CHAR(<fieldName>, 'YYYY-MM-DD HH24:MI:SS')` |

## Примеры

**Пример.** Код выводит выражение для колонки даты регистрации:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->getDateToCharFunction('DATE_REGISTER');
```

## Смотрите также

- [SqlHelper::getCharToDateFunction](get-char-to-date-function.md)
- [SqlHelper::formatDate](format-date.md)
