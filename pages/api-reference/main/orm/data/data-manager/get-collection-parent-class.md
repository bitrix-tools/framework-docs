---
title: Получить родительский класс коллекции DataManager::getCollectionParentClass
description: Метод DataManager::getCollectionParentClass возвращает класс, от которого ORM наследует класс коллекции по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getCollectionParentClass` возвращает класс, от которого ORM наследует класс коллекции таблицы. Наследник переопределяет метод и возвращает свой класс, производный от `Collection`, чтобы коллекции таблицы получили общие методы.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getCollectionParentClass()
```

## Возвращаемое значение

Метод возвращает имя класса. Базовый класс возвращает `Bitrix\Main\ORM\Objectify\Collection`.

## Примеры

**Пример.** Код выводит родительский класс коллекции:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getCollectionParentClass();
```

Код выведет `Bitrix\Main\ORM\Objectify\Collection`.

## Смотрите также

- [DataManager::getCollectionClass](get-collection-class.md)
- [DataManager::getObjectParentClass](get-object-parent-class.md)
