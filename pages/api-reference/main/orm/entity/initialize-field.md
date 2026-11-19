---
title: Создать поле по описанию Entity::initializeField
description: Метод Entity::initializeField создает объект поля ORM по описанию массивом или по готовому объекту и привязывает поле к сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::initializeField` создает объект поля по описанию и привязывает его к сущности. Метод не добавляет поле в сущность — это делает [addField](add-field.md), который вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function initializeField($fieldName, $fieldInfo)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fieldName\* | `string` | Задает имя поля. Для объекта поля непустое нечисловое имя заменяет имя объекта |
| fieldInfo\* | `array` или `Bitrix\Main\ORM\Fields\Field` | Задает поле объектом или описанием массивом |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

Описание массивом — старый формат `getMap`. Метод выбирает класс поля по ключам.

| Ключ | Поле |
| --- | --- |
| `reference` | Связь `Reference` с сущностью из `data_type` |
| `expression` | Выражение `ExpressionField` |
| `USER_TYPE_ID` | Пользовательское поле |
| `data_type` | Поле класса `<Тип>Field`, например `integer` — `IntegerField`, или класс из `data_type` |

## Возвращаемое значение

Метод возвращает объект поля.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Тип в `data_type` неизвестен или описание не массив и не объект поля |

## Примеры

**Пример.** Код создает поле по описанию и проверяет, что поле не попало в сущность:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();
$field = $entity->initializeField('WEIGHT', ['data_type' => 'float']);

echo get_class($field) . ' ' . var_export($entity->hasField('WEIGHT'), true);
```

Код выведет `Bitrix\Main\ORM\Fields\FloatField false`.

## Смотрите также

- [Entity::addField](add-field.md)
- [Концепция ORM](../../../../orm/orm-concepts.md)
