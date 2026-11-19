---
title: Проверить разрешение приватных полей Query::isPrivateFieldsEnabled
description: Метод Query::isPrivateFieldsEnabled проверяет, разрешены ли в запросе приватные поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::isPrivateFieldsEnabled` проверяет, разрешил ли [enablePrivateFields](enable-private-fields.md) приватные поля в запросе.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function isPrivateFieldsEnabled()
```

## Возвращаемое значение

Метод возвращает `true`, если приватные поля разрешены, иначе `false`.

## Примеры

**Пример.** Код проверяет признак до и после разрешения:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = UserTable::query();
$before = $query->isPrivateFieldsEnabled();

var_dump($before, $query->enablePrivateFields()->isPrivateFieldsEnabled());
```

Код выведет:

```text
bool(false)
bool(true)
```

## Смотрите также

- [Query::enablePrivateFields](enable-private-fields.md)
