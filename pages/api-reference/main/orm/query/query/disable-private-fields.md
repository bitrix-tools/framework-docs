---
title: Запретить приватные поля Query::disablePrivateFields
description: Метод Query::disablePrivateFields снова запрещает приватные поля в запросе после enablePrivateFields.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::disablePrivateFields` снова запрещает приватные поля. По умолчанию они запрещены, поэтому метод нужен, только чтобы отменить [enablePrivateFields](enable-private-fields.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function disablePrivateFields()
```

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Примеры

**Пример.** Код пробует выбрать пароль без разрешения:

```php
<?php
use Bitrix\Main\SystemException;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    UserTable::query()->setSelect(['PASSWORD'])->enablePrivateFields()->disablePrivateFields()->setLimit(1)->fetch();
}
catch (SystemException $exception)
{
    echo $exception->getMessage();
}
```

Код выведет `Private field \Bitrix\Main\UserTable.PASSWORD is restricted in query, use Query::enablePrivateFields() to allow it`.

## Смотрите также

- [Query::enablePrivateFields](enable-private-fields.md)
