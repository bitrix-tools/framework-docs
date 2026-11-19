---
title: Получить описание колонок таблицы Connection::getTableFields
description: Метод Connection::getTableFields возвращает колонки таблицы в виде объектов полей ORM и кеширует результат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getTableFields` возвращает колонки таблицы в виде объектов полей ORM. По этим объектам методы [add](add.md) и `SqlHelper::prepareInsert` преобразуют значения под тип колонки.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function getTableFields($tableName);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. В MySQL можно передать подзапрос в скобках, например `(SELECT ...)` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив `имя колонки => объект`, где объект — наследник `Bitrix\Main\ORM\Fields\ScalarField`, например `IntegerField` или `StringField`.

| Реализация | Как получает колонки |
| --- | --- |
| `MysqliConnection` | Выполняет `SELECT * ... LIMIT 0` и берет описание колонок из результата. Имена колонок — как в таблице |
| `PgsqlConnection` | Читает `information_schema.columns` для схемы `public` и приводит имена колонок к верхнему регистру. У строковых полей задает размер и признак полнотекстового индекса |

Метод кеширует результат в объекте соединения. Ключ кеша — имя таблицы в том виде, в каком его передали. В PostgreSQL пустой результат метод не кеширует. Методы [renameTable](rename-table.md), [dropTable](drop-table.md) и [dropColumn](drop-column.md) очищают кеш описания колонок таблицы. После того как код изменил структуру таблицы своим запросом, вызовите [clearCaches](clear-caches.md).

В MySQL метод выполняет запрос в обход [query](query.md). Такой запрос не попадает в сведения [startTracker](start-tracker.md).

Если таблицы нет, MySQL выбрасывает исключение, а PostgreSQL возвращает пустой массив.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например таблицы нет в MySQL |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код выводит имена колонок таблицы пользователей и классы объектов полей:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$fields = Application::getConnection()->getTableFields(UserTable::getTableName());

foreach ($fields as $name => $field)
{
    echo $name . ' — ' . get_class($field) . PHP_EOL;
}
```

## Смотрите также

- [Connection::getTableField](get-table-field.md)
- [Connection::clearCaches](clear-caches.md)
