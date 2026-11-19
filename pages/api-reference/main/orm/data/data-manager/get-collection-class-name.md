---
title: Получить короткое имя класса коллекции DataManager::getCollectionClassName
description: Метод DataManager::getCollectionClassName возвращает имя класса коллекции ORM без пространства имен.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getCollectionClassName` возвращает имя класса коллекции без пространства имен, например `EO_User_Collection`. Метод берет имя из [getCollectionClass](get-collection-class.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
final public static function getCollectionClassName()
```

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код выводит короткое имя класса коллекции:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getCollectionClassName();
```

Код выведет `EO_Language_Collection`.

## Смотрите также

- [DataManager::getCollectionClass](get-collection-class.md)
