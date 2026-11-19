---
title: Получить SQL создания таблицы Entity::compileDbTableStructureDump
description: Метод Entity::compileDbTableStructureDump возвращает SQL-запросы, которые создадут таблицу сущности по ее скалярным полям.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::compileDbTableStructureDump` возвращает SQL-запросы, которые создадут таблицу сущности. Метод не выполняет запросы. Метод нужен, например, чтобы записать SQL в установщик модуля.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function compileDbTableStructureDump()
```

## Возвращаемое значение

Метод возвращает массив SQL-запросов — `CREATE TABLE` и `CREATE UNIQUE INDEX` для полей с `unique` = `true`.

## Особенности

- Метод строит таблицу по [getScalarFields](get-scalar-fields.md). Выражения, связи и пользовательские поля в таблицу не попадают.
- Запрос создания таблицы содержит `IF NOT EXISTS` для MySQL.

## Примеры

**Пример.** Код получает SQL таблицы сущности на лету:

```php
<?php
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::compileEntity('DemoUnit', [
    new IntegerField('ID', ['primary' => true, 'autocomplete' => true]),
    new StringField('NAME', ['required' => true]),
], ['namespace' => 'Vendor\Units', 'table_name' => 'demo_api_units']);

echo implode("\n", $entity->compileDbTableStructureDump());
```

Для MySQL код выведет `CREATE TABLE IF NOT EXISTS `demo_api_units` (`ID` int NOT NULL AUTO_INCREMENT, `NAME` varchar(255) NOT NULL, PRIMARY KEY(`ID`))`.

## Смотрите также

- [Entity::createDbTable](create-db-table.md)
