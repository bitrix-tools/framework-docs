---
title: Получить число колонок результата Result::getFieldsCount
description: Метод Result::getFieldsCount возвращает число колонок в результате запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getFieldsCount` возвращает число колонок в результате запроса.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function getFieldsCount(): int
```

## Возвращаемое значение

Метод возвращает целое число `int`. Источник значения зависит от реализации.

| Реализация | Источник значения |
| --- | --- |
| `Result` | Базовый класс всегда возвращает `0` |
| `MysqliResult` | Свойство `field_count` результата `mysqli`. Если результата нет, метод возвращает `0` |
| `PgsqlResult` | Функция `pg_num_fields` |

## Примеры

**Пример.** Код выводит число колонок результата:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID, LOGIN, EMAIL FROM ' . UserTable::getTableName(),
    1
);

echo $result->getFieldsCount();
```

Код выведет `3`.

## Смотрите также

- [Result::getFields](get-fields.md)
- [Result::getSelectedRowsCount](get-selected-rows-count.md)
