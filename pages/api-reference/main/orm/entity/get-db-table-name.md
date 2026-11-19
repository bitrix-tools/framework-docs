---
title: Получить имя таблицы Entity::getDBTableName
description: Метод Entity::getDBTableName возвращает имя таблицы базы данных сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getDBTableName` возвращает имя таблицы базы данных сущности. Имя задает [DataManager::getTableName](../data/data-manager/get-table-name.md). Если класс таблицы не задал имя, [postInitialize](post-initialize.md) строит его по классу.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getDBTableName()
```

## Возвращаемое значение

Метод возвращает строку. У сущности из [getInstanceByQuery](get-instance-by-query.md) это текст подзапроса в скобках.

## Примеры

**Пример.** Код читает имя таблицы сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getDBTableName();
```

Код выведет `b_language`.

## Смотрите также

- [DataManager::getTableName](../data/data-manager/get-table-name.md)
