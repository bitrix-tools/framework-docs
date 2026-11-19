---
title: Удалить запись поискового индекса UserTable::deleteIndexRecord
description: Метод UserTable::deleteIndexRecord удаляет запись пользователя из поискового индекса пользователей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `UserTable::deleteIndexRecord` удаляет запись пользователя из поискового индекса `Bitrix\Main\UserIndexTable`. Метод `CUser::Delete` вызывает его сам при удалении пользователя.

Сигнатура метода в классе `Bitrix\Main\UserTable`:

```php
public static function deleteIndexRecord($id)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `int` | Задает идентификатор пользователя |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код удаляет запись индекса пользователя с идентификатором `1` и сразу строит ее заново:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

UserTable::deleteIndexRecord(1);
var_dump(UserTable::indexRecord(1));
```

## Смотрите также

- [UserTable::indexRecord](index-record.md)
