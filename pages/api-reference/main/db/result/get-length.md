---
title: Получить размер строки Result::getLength
description: Метод Result::getLength возвращает размер последней прочитанной строки результата в байтах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getLength` возвращает размер последней прочитанной строки в байтах. Соединение вызывает метод, когда собирает сведения о запросах после [Connection::startTracker](../connection/start-tracker.md).

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function getLength(): int
```

## Возвращаемое значение

Метод возвращает целое число `int`. Источник значения зависит от реализации.

| Реализация | Источник значения |
| --- | --- |
| `Result` | Базовый класс всегда возвращает `0` |
| `MysqliResult` | Сумма длин значений последней прочитанной строки из свойства `lengths` результата `mysqli`. Вызывайте метод только после `fetch` или `fetchRaw`, которые вернули строку |
| `PgsqlResult` | Работает как в базовом классе и возвращает `0` |

## Примеры

**Пример.** Код читает строку и выводит ее размер в байтах:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT LOGIN, EMAIL FROM ' . UserTable::getTableName() . ' ORDER BY ID',
    1
);

if ($result->fetch())
{
    echo $result->getLength();
}
```

## Смотрите также

- [Result::hasBigFields](has-big-fields.md)
- [Connection::startTracker](../connection/start-tracker.md)
