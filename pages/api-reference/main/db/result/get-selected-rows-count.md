---
title: Получить число строк результата Result::getSelectedRowsCount
description: Метод Result::getSelectedRowsCount возвращает число строк, которые вернул запрос.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Result::getSelectedRowsCount` возвращает число строк, которые вернул запрос. Если в запросе есть ограничение по числу строк, метод возвращает число строк с учетом ограничения. Общее число строк без ограничения возвращает [getCount](get-count.md). Аналог в классическом API — `CDBResult::SelectedRowsCount`.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
abstract public function getSelectedRowsCount();
```

## Возвращаемое значение

Метод возвращает целое число `int`. Источник значения зависит от реализации.

| Реализация | Источник значения |
| --- | --- |
| `MysqliResult` | Свойство `num_rows` результата `mysqli`. Если результата нет, например после запроса `UPDATE`, метод возвращает `0` |
| `PgsqlResult` | Функция `pg_num_rows` |
| `ArrayResult` | Число элементов массива |

## Примеры

**Пример.** Код выводит, сколько строк вернул запрос с ограничением в пять строк:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query('SELECT ID FROM ' . UserTable::getTableName(), 5);

echo $result->getSelectedRowsCount();
```

## Смотрите также

- [Result::getCount](get-count.md)
- [Result::getFieldsCount](get-fields-count.md)
