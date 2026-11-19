---
title: Обновить запись поискового индекса UserTable::indexRecord
description: Метод UserTable::indexRecord заново строит запись пользователя в поисковом индексе пользователей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `UserTable::indexRecord` читает поля пользователя из [getIndexedFields](get-indexed-fields.md) и записывает их в поисковый индекс `Bitrix\Main\UserIndexTable`. Если запись индекса уже есть, метод заменяет ее. Методы `CUser::Add` и `CUser::Update` вызывают его сами, поэтому вызывать метод вручную нужно, только если данные пользователя изменили в обход `CUser`.

Сигнатура метода в классе `Bitrix\Main\UserTable`:

```php
public static function indexRecord($id)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `int` | Задает идентификатор пользователя. Метод приводит значение к целому числу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если записал индекс. Метод возвращает `false`, если `id` после приведения к целому числу равен `0` или пользователя с таким идентификатором нет.

## Особенности

Если установлены модули `intranet` и `humanresources`, метод добавляет в индекс названия подразделений пользователя из поля `UF_DEPARTMENT`.

## Примеры

**Пример.** Код обновляет индекс пользователя с идентификатором `1`:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(UserTable::indexRecord(1));
```

## Смотрите также

- [UserTable::deleteIndexRecord](delete-index-record.md)
- [UserTable::shouldReindex](should-reindex.md)
