---
title: Проверить большой тип колонки SqlHelper::isBigType
description: Метод SqlHelper::isBigType проверяет, относится ли тип колонки к большим типам, например BLOB.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::isBigType` проверяет, относится ли тип колонки к большим типам. В MySQL метод результата [hasBigFields](../result/has-big-fields.md) вызывает его для колонок, пока не найдет большой тип.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function isBigType($type): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| type\* | `mixed` | Задает тип колонки в формате драйвера. В MySQL — константа `MYSQLI_TYPE_*` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true` для большого типа, иначе `false`.

| Реализация | Большие типы |
| --- | --- |
| `SqlHelper`, `PgsqlSqlHelper` | Нет, метод всегда возвращает `false` |
| `MysqliSqlHelper` | `TINY_BLOB`, `MEDIUM_BLOB`, `LONG_BLOB`, `BLOB`, а также `JSON`, если константа `MYSQLI_TYPE_JSON` определена |

## Примеры

**Пример.** Код проверяет тип `BLOB`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getConnection()->getSqlHelper()->isBigType(MYSQLI_TYPE_BLOB));
```

## Смотрите также

- [Result::hasBigFields](../result/has-big-fields.md)
