---
title: Преобразовать строку для SQL SqlHelper::convertToDbString
description: Метод SqlHelper::convertToDbString экранирует строку и берет ее в одинарные кавычки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToDbString` экранирует строку через [forSql](for-sql.md) и берет ее в одинарные кавычки. Результат можно подставить в SQL как строковый литерал.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDbString($value, $length = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает строку |
| length | `int`, `null` | Задает наибольшую длину строки в символах. Метод обрезает строку до экранирования. По умолчанию — `null`, без ограничения |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` в одинарных кавычках.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код готовит строку с апострофом:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->convertToDbString("kg's");
```

Для MySQL код выведет `'kg\'s'`.

## Смотрите также

- [SqlHelper::forSql](for-sql.md)
- [SqlHelper::convertFromDbString](convert-from-db-string.md)
