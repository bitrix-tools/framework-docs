---
title: Получить поля поискового индекса UserTable::getIndexedFields
description: Метод UserTable::getIndexedFields возвращает поля пользователя, которые попадают в поисковый индекс пользователей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `UserTable::getIndexedFields` возвращает имена полей пользователя, из которых [indexRecord](index-record.md) строит запись поискового индекса.

Сигнатура метода в классе `Bitrix\Main\UserTable`:

```php
public static function getIndexedFields(): array
```

## Возвращаемое значение

Метод возвращает массив имен полей:

- `ID`, `LOGIN`, `EMAIL`,
- `NAME`, `SECOND_NAME`, `LAST_NAME`,
- `WORK_POSITION`, `PERSONAL_PROFESSION`, `PERSONAL_WWW`,
- `PERSONAL_MOBILE`, `PERSONAL_PHONE`, `WORK_PHONE`, `WORK_COMPANY`,
- `PERSONAL_CITY`, `PERSONAL_STREET`, `PERSONAL_STATE`, `PERSONAL_COUNTRY`, `PERSONAL_ZIP`, `PERSONAL_MAILBOX`,
- `WORK_CITY`, `WORK_STREET`, `WORK_STATE`, `WORK_ZIP`, `WORK_COUNTRY`, `WORK_MAILBOX`.

Если установлен модуль `intranet`, метод добавляет в конец массива поле `UF_DEPARTMENT`.

## Примеры

**Пример.** Код выводит число полей индекса:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo count(UserTable::getIndexedFields());
```

## Смотрите также

- [UserTable::shouldReindex](should-reindex.md)
- [UserTable::indexRecord](index-record.md)
