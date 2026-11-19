---
title: Создать поля сущности Entity::postInitialize
description: Метод Entity::postInitialize создает поля сущности по описанию, находит первичный ключ, задает имя таблицы по умолчанию и подключает пользовательские поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::postInitialize` завершает построение сущности после [initialize](initialize.md). Метод [getInstance](get-instance.md) вызывает его сам. Прикладному коду вызывать метод не нужно.

Метод выполняет шаги по порядку.

1. Задает имя сущности — имя класса таблицы без суффикса `Table`.
2. Если класс таблицы не задал имя таблицы, строит его. Пример — `b_vendor_units_unit_price` для класса `Vendor\Units\UnitPriceTable`.
3. Создает поля из описания методом [addField](add-field.md) и находит первичный ключ.
4. Подключает пользовательские поля, если у таблицы есть объект пользовательских полей.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function postInitialize()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | У таблицы есть поля, но нет первичного ключа |
| `Bitrix\Main\ArgumentException` | Описание поля содержит неизвестный тип |

## Особенности

- Имя таблицы по умолчанию начинается с `b_`. Метод пропускает пространство имен `Bitrix` и модуль `Main`, остальные части пишет строчными буквами через `_`, имя сущности — в `snake_case`.
- Если имя сущности совпадает с последней частью пространства имен, метод его не добавляет. Класс `Vendor\Units\UnitsTable` получит таблицу `b_vendor_units`.
- Класс таблицы может переопределить свой статический метод `postInitialize`, чтобы изменить сущность после построения.

## Примеры

**Пример.** Код создает сущность без имени таблицы и читает построенное имя:

```php
<?php
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::compileEntity('UnitPrice', [new IntegerField('ID', ['primary' => true])], ['namespace' => 'Vendor\Units']);

echo $entity->getDBTableName();
```

Код выведет `b_vendor_units_unit_price`.

## Смотрите также

- [Entity::initialize](initialize.md)
- [DataManager::postInitialize](../data/data-manager/post-initialize.md)
