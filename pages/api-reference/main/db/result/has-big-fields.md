---
title: Проверить колонки больших типов Result::hasBigFields
description: Метод Result::hasBigFields проверяет, есть ли в результате колонки типов BLOB или JSON.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::hasBigFields` проверяет, есть ли в результате колонки больших типов. Соединение записывает этот признак в сведения о запросе, если код включил отслеживание через [Connection::startTracker](../connection/start-tracker.md).

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function hasBigFields(): bool
```

## Возвращаемое значение

Метод возвращает `true`, если в результате есть колонка большого типа, иначе `false`.

| Реализация | Какие типы считает большими |
| --- | --- |
| `Result` | Базовый класс всегда возвращает `false` |
| `MysqliResult` | Типы `BLOB` всех размеров, а также `JSON`, если константа `MYSQLI_TYPE_JSON` определена. Если у объекта результата нет соединения, метод возвращает `false` |
| `PgsqlResult` | Работает как в базовом классе и возвращает `false` |

## Примеры

**Пример.** Код проверяет, есть ли в результате колонки больших типов:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID, LOGIN FROM ' . UserTable::getTableName(),
    1
);

var_dump($result->hasBigFields());
```

## Смотрите также

- [Result::getLength](get-length.md)
