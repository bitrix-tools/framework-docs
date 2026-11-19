---
title: Подготовить текст для полнотекстового поиска SqlHelper::convertToFullText
description: Метод SqlHelper::convertToFullText возвращает текст для колонки с полнотекстовым индексом в виде выражения SQL.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToFullText` возвращает текст для колонки с полнотекстовым индексом в виде выражения, которое можно подставить в SQL-запрос.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToFullText($value, $maxLength = 0)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает текст |
| maxLength | `int` | Задает наибольшую длину текста в символах. По умолчанию — `0`, без ограничения |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Результат |
| --- | --- |
| `SqlHelper`, `MysqliSqlHelper` | Экранированный текст в одинарных кавычках. При `maxLength` больше нуля метод обрезает текст до этой длины |
| `PgsqlSqlHelper` | Вызов функции базы данных `safe_text_for_tsvector('...')`. Метод обрезает текст до `maxLength` и не больше чем до 1 000 000 символов |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код готовит текст длиной не больше 20 символов:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->convertToFullText("Kilogram's unit of mass definition", 20);
```

Для MySQL код выведет `'Kilogram\'s unit of m'`.

## Смотрите также

- [SqlHelper::getMatchFunction](get-match-function.md)
- [SqlHelper::forSql](for-sql.md)
