---
title: Получить соединение Entity::getConnection
description: Метод Entity::getConnection возвращает соединение с базой данных, которое использует таблица сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getConnection` возвращает соединение с базой данных таблицы сущности. Имя соединения задает [DataManager::getConnectionName](../data/data-manager/get-connection-name.md), по умолчанию — `default`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getConnection()
```

## Возвращаемое значение

Метод возвращает объект [Connection](../../db/connection/index.md), например `Bitrix\Main\DB\MysqliConnection`.

## Примеры

**Пример.** Код проверяет, есть ли таблица сущности в базе данных:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();

var_dump($entity->getConnection()->isTableExists($entity->getDBTableName()));
```

Код выведет `bool(true)`.

## Смотрите также

- [Connection](../../db/connection/index.md)
- [Entity::getDBTableName](get-db-table-name.md)
