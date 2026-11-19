---
title: Добавить поле в сущность Entity::addField
description: Метод Entity::addField создает поле по описанию и добавляет его в сущность ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::addField` добавляет поле в сущность. Метод создает поле методом [initializeField](initialize-field.md) и регистрирует его — поле станет доступно в запросах и объектах. Метод нужен для сущностей из [compileEntity](compile-entity.md) и для полей, которые модуль добавляет к чужой сущности в `postInitialize`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function addField($fieldInfo, $fieldName = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fieldInfo\* | `array` или `Bitrix\Main\ORM\Fields\Field` | Задает поле объектом или описанием массивом |
| fieldName | `string` или `null` | Задает имя поля. Для объекта поля можно не передавать. По умолчанию — `null` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект поля. Если поле с таким именем уже есть, метод выдает предупреждение PHP `E_USER_WARNING` и возвращает `false`. У копии сущности (`clone`) метод заменяет поле без предупреждения.

## Особенности

- Имена полей не зависят от регистра — `name` и `NAME` — одно поле.
- Скалярное поле с `primary` = `true` попадает в первичный ключ. Если у него еще и `autocomplete` = `true`, оно станет полем с автоинкрементом.
- Сущность одна на класс таблицы, поэтому поле появится во всех запросах к этой таблице до конца хита.

## Примеры

**Пример.** Код добавляет поле в сущность на лету:

```php
<?php
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::compileEntity('DemoUnit', [new IntegerField('ID', ['primary' => true])], ['namespace' => 'Vendor\Units']);
$field = $entity->addField(new StringField('CODE'));

echo get_class($field) . ' ' . var_export($entity->hasField('code'), true) . ' ' . var_export(@$entity->addField(new StringField('CODE')), true);
```

Код выведет `Bitrix\Main\ORM\Fields\StringField true false`.

## Смотрите также

- [Entity::initializeField](initialize-field.md)
- [Entity::getFields](get-fields.md)
