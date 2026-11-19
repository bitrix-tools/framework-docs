---
title: Ограничить число строк запроса SqlHelper::getTopSql
description: Метод SqlHelper::getTopSql добавляет к запросу ограничение по числу строк и смещение.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `SqlHelper::getTopSql` добавляет к тексту запроса ограничение по числу строк и смещение по правилам базы данных. Метод [Connection::query](../connection/query.md) вызывает его, если код передает `limit`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getTopSql($sql, $limit, $offset = 0);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sql\* | `string` | Задает текст запроса без ограничения по числу строк |
| limit\* | `int` | Задает наибольшее число строк. Метод приводит значение к целому числу. При значении `0` и меньше метод не добавляет ограничение |
| offset | `int` | Задает число строк, которые нужно пропустить. Метод приводит значение к целому числу. По умолчанию — `0` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — текст запроса с ограничением.

| Реализация | Что добавляет |
| --- | --- |
| `MysqliSqlHelper` | `LIMIT <offset>, <limit>` на новой строке. Без ограничения возвращает запрос без изменений |
| `PgsqlSqlHelper` | `LIMIT <limit>` на новой строке, а при `offset` больше нуля — также `OFFSET <offset>`. Перевод строки добавляет всегда |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | `offset` больше нуля, а `limit` не больше нуля |

## Примеры

**Пример.** Код выводит запрос второй страницы по 20 строк:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

echo $helper->getTopSql('SELECT ID FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID', 20, 20);
```

## Смотрите также

- [Connection::query](../connection/query.md)
