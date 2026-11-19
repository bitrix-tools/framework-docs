---
title: Создать таблицу Entity::createDbTable
description: Метод Entity::createDbTable создает таблицу сущности в базе данных по ее скалярным полям.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Entity::createDbTable` создает таблицу сущности в базе данных. Метод выполняет запросы из [compileDbTableStructureDump](compile-db-table-structure-dump.md). Метод нужен в установщике модуля и для сущностей на лету.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function createDbTable()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Если таблица уже есть, MySQL не изменит ее. Если у сущности есть поля с `unique` = `true`, повторный вызов завершится ошибкой SQL: запрос создания индекса не проверяет, есть ли индекс.
- Метод не удаляет таблицу. Для удаления используйте `Connection::dropTable`.

## Примеры

**Пример.** Код создает таблицу, проверяет ее и удаляет:

```php
<?php
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::compileEntity('DemoUnit', [
    new IntegerField('ID', ['primary' => true, 'autocomplete' => true]),
    new StringField('NAME'),
], ['namespace' => 'Vendor\Units', 'table_name' => 'demo_api_units']);

$connection = $entity->getConnection();
$entity->createDbTable();

var_dump($connection->isTableExists('demo_api_units'));
$connection->dropTable('demo_api_units');
```

Код выведет `bool(true)`.

## Смотрите также

- [Entity::compileDbTableStructureDump](compile-db-table-structure-dump.md)
- [Entity::compileEntity](compile-entity.md)
