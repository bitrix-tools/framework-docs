---
title: Создать объект Entity::createObject
description: Метод Entity::createObject создает новый объект сущности со значениями по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::createObject` создает новый объект сущности. Метод не сохраняет объект в базе данных. Чтобы сохранить объект, вызовите у него `save()`. Метод работает как [DataManager::createObject](../data/data-manager/create-object.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function createObject($setDefaultValues = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| setDefaultValues | `bool` или `array` | Значение `true` заполняет поля значениями по умолчанию. Массив `поле => значение` задает свои значения вместо значений по умолчанию, остальные поля метод заполняет из описания полей. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект класса из [getObjectClass](get-object-class.md).

## Примеры

**Пример.** Код создает объект и задает название:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$language = LanguageTable::getEntity()->createObject();
$language->setName('Kazakh');

echo get_class($language) . ' ' . $language->getName();
```

Код выведет `Bitrix\Main\Localization\EO_Language Kazakh`.

## Смотрите также

- [Entity::createCollection](create-collection.md)
- [Объекты](../../../../orm/objects.md)
