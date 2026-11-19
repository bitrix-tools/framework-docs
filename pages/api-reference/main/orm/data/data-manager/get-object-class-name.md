---
title: Получить короткое имя класса объекта DataManager::getObjectClassName
description: Метод DataManager::getObjectClassName возвращает имя класса объекта ORM без пространства имен.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getObjectClassName` возвращает имя класса объекта ORM без пространства имен, например `EO_User`. Метод берет имя из [getObjectClass](get-object-class.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
final public static function getObjectClassName()
```

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код выводит короткое имя класса объекта:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo UserTable::getObjectClassName();
```

Код выведет `EO_User`.

## Смотрите также

- [DataManager::getObjectClass](get-object-class.md)
