---
title: Собрать поиск всех слов SqlHelper::getMatchAndExpression
description: Метод SqlHelper::getMatchAndExpression собирает строку полнотекстового поиска, в которой должны найтись все слова.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getMatchAndExpression` собирает строку полнотекстового поиска, в которой должны найтись все слова. Экранируйте строку и передайте ее в [getMatchFunction](get-match-function.md).

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getMatchAndExpression($values, $prefixSearch = false)
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
| `MysqliSqlHelper` | `+a +b` | `+a* +b*` |
| `PgsqlSqlHelper` | `a & b` | `a:* & b:*` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код собирает строку поиска по началу двух слов:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->getMatchAndExpression(['unit', 'mass'], true);
```

Для MySQL код выведет `+unit* +mass*`.

## Смотрите также

- [SqlHelper::getMatchFunction](get-match-function.md)
- [SqlHelper::getMatchOrExpression](get-match-or-expression.md)
