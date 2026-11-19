---
title: Получить таблицы запроса SqlHelper::getQueryTables
description: Метод SqlHelper::getQueryTables разбирает текст SQL-запроса и возвращает имена таблиц, к которым он обращается.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getQueryTables` разбирает текст SQL-запроса и возвращает имена таблиц, к которым он обращается. Пул соединений по этому списку выбирает, можно ли отправить запрос на реплику. Реализации MySQL и PostgreSQL используют метод базового класса.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getQueryTables(string $sql, int $maxLevel = -1): array
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sql\* | `string` | Задает текст запроса |
| maxLevel | `int` | Задает наибольшую глубину скобок. Уровнем считается любая открывающая скобка, в том числе в `COUNT(*)` и `IN (...)`. Как только разбор доходит до скобки глубже `maxLevel`, метод прекращает разбор всего остального текста. По умолчанию — `-1`, без ограничения |

## Возвращаемое значение

Метод возвращает массив `имя таблицы => имя таблицы`.

Метод считает таблицей слово после `FROM`, `JOIN`, `STRAIGHT_JOIN`, запятой в части `FROM`, а также после `INTO`, `UPDATE`, `TABLE`, `TRUNCATE` и `IF EXISTS`. Метод удаляет обратные кавычки вокруг имени и пропускает текст в одинарных и двойных кавычках.

Имя в двойных кавычках, как в PostgreSQL, метод не распознает. Таблицей тогда становится следующее слово, например псевдоним: для `FROM "demo_api_units" u` метод вернет `u`.

## Примеры

**Пример.** Код выводит таблицы запроса с подзапросом:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$sql = 'SELECT u.CODE FROM demo_api_units u JOIN demo_api_counters c ON c.CODE = u.CODE'
    . ' WHERE u.ID IN (SELECT UNIT_ID FROM demo_api_links)';

print_r(Application::getConnection()->getSqlHelper()->getQueryTables($sql));
```

Код выведет `demo_api_units`, `demo_api_counters` и `demo_api_links`.

## Смотрите также

- [Connection::query](../connection/query.md)
