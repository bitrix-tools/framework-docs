---
title: Собрать поиск любого слова SqlHelper::getMatchOrExpression
description: Метод SqlHelper::getMatchOrExpression собирает строку полнотекстового поиска, в которой должно найтись хотя бы одно слово.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getMatchOrExpression` собирает строку полнотекстового поиска, в которой должно найтись хотя бы одно слово. Экранируйте строку и передайте ее в [getMatchFunction](get-match-function.md).

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getMatchOrExpression($values, $prefixSearch = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| values\* | `string[]` | Задает слова поиска |
| prefixSearch | `bool` | Ищет слова по началу, если равен `true`. По умолчанию — `false` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` без экранирования и кавычек.

| Реализация | Строка для слов `a` и `b` | С `prefixSearch` |
| --- | --- | --- |
| `MysqliSqlHelper` | `a b` | `a* b*` |
| `PgsqlSqlHelper` | `a \| b` | `a:* \| b:*` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код собирает строку поиска любого из двух слов:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->getMatchOrExpression(['mass', 'length']);
```

Для MySQL код выведет `mass length`.

## Смотрите также

- [SqlHelper::getMatchFunction](get-match-function.md)
- [SqlHelper::getMatchAndExpression](get-match-and-expression.md)
