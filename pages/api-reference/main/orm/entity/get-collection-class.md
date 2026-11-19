---
title: Получить класс коллекции Entity::getCollectionClass
description: Метод Entity::getCollectionClass возвращает полное имя класса коллекции сущности, например \Bitrix\Main\Localization\EO_Language_Collection.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getCollectionClass` возвращает полное имя класса коллекции сущности. Коллекции этого класса возвращают `fetchCollection` и [createCollection](create-collection.md). Класс задает [DataManager::getCollectionClass](../data/data-manager/get-collection-class.md). По умолчанию это `EO_<Сущность>_Collection`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getCollectionClass()
```

## Возвращаемое значение

Метод возвращает имя класса с ведущим `\`.

## Примеры

**Пример.** Код читает класс коллекции сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getCollectionClass();
```

Код выведет `\Bitrix\Main\Localization\EO_Language_Collection`.

## Смотрите также

- [Entity::getCollectionClassName](get-collection-class-name.md)
- [Коллекции](../../../../orm/collections.md)
