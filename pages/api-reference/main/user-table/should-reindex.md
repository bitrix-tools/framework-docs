---
title: Проверить необходимость переиндексации UserTable::shouldReindex
description: Метод UserTable::shouldReindex проверяет, есть ли среди измененных полей пользователя поля поискового индекса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `UserTable::shouldReindex` проверяет, затрагивает ли изменение пользователя поля поискового индекса. Метод `CUser::Update` вызывает его и обновляет индекс через [indexRecord](index-record.md), только если метод вернул `true`.

Сигнатура метода в классе `Bitrix\Main\UserTable`:

```php
public static function shouldReindex(array $fields): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fields\* | `array` | Задает измененные поля пользователя. Метод проверяет только ключи массива |

## Возвращаемое значение

Метод возвращает `true`, если хотя бы один ключ массива входит в список [getIndexedFields](get-indexed-fields.md). Метод не учитывает ключ `ID`. Иначе метод возвращает `false`.

## Примеры

**Пример.** Код проверяет два набора изменений. Должность входит в индекс, дата последней авторизации — нет:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(UserTable::shouldReindex(['ID' => 1, 'WORK_POSITION' => 'Engineer']));
var_dump(UserTable::shouldReindex(['ID' => 1, 'LAST_LOGIN' => null]));
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [UserTable::getIndexedFields](get-indexed-fields.md)
- [UserTable::indexRecord](index-record.md)
