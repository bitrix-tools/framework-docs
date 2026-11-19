---
title: Получить имя индекса Connection::getIndexName
description: Метод Connection::getIndexName ищет индекс таблицы по списку колонок и возвращает его имя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getIndexName` ищет индекс таблицы по списку колонок и возвращает его имя. Аналог в классическом API — `CDatabase::GetIndexName`, он вызывает этот метод и вместо `null` возвращает пустую строку.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function getIndexName($tableName, array $columns, $strict = false);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. В MySQL метод удаляет из имени все символы, кроме латинских букв, цифр и `_` |
| columns\* | `array` | Задает имена колонок в порядке индекса |
| strict | `bool` | Требует точного совпадения списка колонок, если равен `true`. По умолчанию — `false`, тогда подходит индекс, который начинается с этих колонок |

Типы `tableName` и `strict` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает имя первого подходящего индекса строкой `string` или `null`, если индекса нет. Для пустого массива `columns` метод возвращает `null`.

Метод сравнивает список колонок как строку имен через запятую. В нестрогом режиме подходит индекс, у которого эта строка начинается с переданных имен. Поэтому список `['ID']` найдет и индекс по колонке `ID_USER`.

Если таблицы нет, MySQL выбрасывает исключение, а PostgreSQL возвращает `null`.

| Реализация | Регистр имен колонок |
| --- | --- |
| `MysqliConnection` | Сравнивает с учетом регистра |
| `PgsqlConnection` | Сравнивает без учета регистра. Для полнотекстового индекса берет колонки из выражения индекса |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например таблицы нет в MySQL |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код находит индекс по префиксу колонок и по точному списку:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL, SORT INT)');

try
{
    $connection->createIndex('demo_api_status', 'ix_demo_api_status_sort', ['STATUS', 'SORT']);

    var_dump($connection->getIndexName('demo_api_status', ['STATUS']));
    var_dump($connection->getIndexName('demo_api_status', ['STATUS'], true));
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

Первый вызов вернет `ix_demo_api_status_sort`, второй — `null`.

## Смотрите также

- [Connection::isIndexExists](is-index-exists.md)
- [Connection::createIndex](create-index.md)
