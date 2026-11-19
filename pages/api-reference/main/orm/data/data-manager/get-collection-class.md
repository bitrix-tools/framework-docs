---
title: Получить класс коллекции DataManager::getCollectionClass
description: Метод DataManager::getCollectionClass возвращает полное имя класса коллекции ORM таблицы. Наследник переопределяет его, чтобы задать свой класс.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getCollectionClass` возвращает полное имя класса коллекции, которую возвращают `fetchCollection` и [createCollection](create-collection.md). Наследник переопределяет метод, чтобы задать свой класс коллекции. Свой класс наследуют от класса из [getCollectionParentClass](get-collection-parent-class.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getCollectionClass()
```

## Возвращаемое значение

Метод возвращает имя класса. По умолчанию имя состоит из имени класса объекта и суффикса `_Collection`, например `\Bitrix\Main\EO_User_Collection`. Имя начинается с `\`.

## Примеры

**Пример.** Код выводит класс коллекции таблицы пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo UserTable::getCollectionClass();
```

Код выведет `\Bitrix\Main\EO_User_Collection`.

## Смотрите также

- [DataManager::getCollectionClassName](get-collection-class-name.md)
- [DataManager::getObjectClass](get-object-class.md)
