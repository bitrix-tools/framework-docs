---
title: Разрешить приватные поля Query::enablePrivateFields
description: Метод Query::enablePrivateFields разрешает выбирать приватные поля, например пароль пользователя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::enablePrivateFields` разрешает приватные поля в выборке, группировке и сортировке. У приватного поля параметр `private` равен `true` — например, у `PASSWORD` в `UserTable`. Без разрешения запрос с таким полем выбросит исключение.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function enablePrivateFields()
```

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

В фильтре приватные поля запрещены всегда, даже после вызова метода. Запрос выбросит `SystemException` с текстом `Private field ... is restricted in filter`.

## Примеры

**Пример.** Код выбирает поле пароля с разрешением:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = UserTable::query()->setSelect(['ID', 'PASSWORD'])->setLimit(1)->enablePrivateFields()->fetch();

echo implode(',', array_keys($row));
```

Код выведет `ID,PASSWORD`.

## Смотрите также

- [Query::disablePrivateFields](disable-private-fields.md)
- [Query::isFieldPrivate](is-field-private.md)
