---
title: Получить строку без преобразований Result::fetchRaw
description: Метод Result::fetchRaw возвращает следующую строку результата в том виде, в каком ее вернул драйвер базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.1

{% endnote %}

Метод `Result::fetchRaw` возвращает следующую строку результата без преобразований, которые выполняет [fetch](fetch.md). Метод оставляет даты строками, не десериализует значения и не переименовывает колонки.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function fetchRaw()
```

## Возвращаемое значение

Метод возвращает массив `имя колонки => значение` или `false`, если строк больше нет.

Строку готовит реализация результата.

| Реализация | Строка |
| --- | --- |
| `MysqliResult` | Строка `mysqli` без изменений |
| `PgsqlResult` | Ключи в верхнем регистре. Значения колонок типа `bytea` раскодированы функцией `pg_unescape_bytea` |

Если код включил отслеживание через [Connection::startTracker](../connection/start-tracker.md), метод добавляет время выборки и размер строки в сведения о запросе.

## Примеры

**Пример.** Код сравнивает дату регистрации из `fetchRaw` и `fetch`. В первом случае это строка, во втором — объект:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$sql = 'SELECT DATE_REGISTER FROM ' . UserTable::getTableName() . ' ORDER BY ID';

$raw = $connection->query($sql, 1)->fetchRaw();
$converted = $connection->query($sql, 1)->fetch();

echo gettype($raw['DATE_REGISTER']) . ' / ' . get_class($converted['DATE_REGISTER']);
```

Код выведет `string / Bitrix\Main\Type\DateTime`.

## Смотрите также

- [Result::fetch](fetch.md)
