---
title: Получить суффикс псевдонимов таблиц Query::getTableAliasPostfix
description: Метод Query::getTableAliasPostfix возвращает суффикс псевдонимов таблиц запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getTableAliasPostfix` возвращает суффикс псевдонимов таблиц, который задал [setTableAliasPostfix](set-table-alias-postfix.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getTableAliasPostfix()
```

## Возвращаемое значение

Метод возвращает строку. По умолчанию — пустая строка.

## Примеры

**Пример.** Код читает суффикс до и после изменения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();
$before = $query->getTableAliasPostfix();

echo var_export($before, true) . ' ' . $query->setTableAliasPostfix('_sub')->getTableAliasPostfix();
```

Код выведет `'' _sub`.

## Смотрите также

- [Query::setTableAliasPostfix](set-table-alias-postfix.md)
