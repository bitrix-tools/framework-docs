---
title: Создать коллекцию Entity::createCollection
description: Метод Entity::createCollection создает пустую коллекцию объектов сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::createCollection` создает пустую коллекцию объектов сущности. Метод работает как [DataManager::createCollection](../data/data-manager/create-collection.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function createCollection()
```

## Возвращаемое значение

Метод возвращает коллекцию класса из [getCollectionClass](get-collection-class.md).

## Примеры

**Пример.** Код создает коллекцию и добавляет в нее объект:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();
$collection = $entity->createCollection();
$collection->add($entity->wakeUpObject(['LID' => 'kz']));

echo get_class($collection) . ' ' . count($collection);
```

Код выведет `Bitrix\Main\Localization\EO_Language_Collection 1`.

## Смотрите также

- [Entity::createObject](create-object.md)
- [Коллекции](../../../../orm/collections.md)
