---
title: Получить короткое имя класса коллекции Entity::getCollectionClassName
description: Метод Entity::getCollectionClassName возвращает имя класса коллекции сущности без пространства имен.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getCollectionClassName` возвращает имя класса коллекции без пространства имен. Метод вызывает [DataManager::getCollectionClassName](../data/data-manager/get-collection-class-name.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getCollectionClassName()
```

## Возвращаемое значение

Метод возвращает строку, например `EO_Language_Collection`.

## Примеры

**Пример.** Код читает короткое имя класса коллекции:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getCollectionClassName();
```

Код выведет `EO_Language_Collection`.

## Смотрите также

- [Entity::getCollectionClass](get-collection-class.md)
