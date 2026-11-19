---
title: Получить лимит Query::getLimit
description: Метод Query::getLimit возвращает лимит записей запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getLimit` возвращает лимит записей, который задал [setLimit](set-limit.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getLimit()
```

## Возвращаемое значение

Метод возвращает число или `null`, если лимит не задан.

## Примеры

**Пример.** Код читает лимит до и после `setLimit`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();
$before = $query->getLimit();

echo var_export($before, true) . ' ' . $query->setLimit(20)->getLimit();
```

Код выведет `NULL 20`.

## Смотрите также

- [Query::setLimit](set-limit.md)
