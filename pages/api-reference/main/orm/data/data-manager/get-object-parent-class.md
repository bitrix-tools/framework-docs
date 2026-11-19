---
title: Получить родительский класс объекта DataManager::getObjectParentClass
description: Метод DataManager::getObjectParentClass возвращает класс, от которого ORM наследует класс объекта по умолчанию. Наследник переопределяет его, чтобы добавить объектам общие методы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getObjectParentClass` возвращает класс, от которого ORM наследует класс объекта таблицы. Наследник переопределяет метод и возвращает свой класс, производный от `EntityObject`. Так объекты таблицы получают общие методы без своего класса для каждой таблицы.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getObjectParentClass()
```

## Возвращаемое значение

Метод возвращает имя класса. Базовый класс возвращает `Bitrix\Main\ORM\Objectify\EntityObject`.

## Примеры

**Пример.** Код выводит родительский класс объекта таблицы языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getObjectParentClass() . "\n" . get_parent_class(LanguageTable::createObject());
```

Код выведет:

```text
Bitrix\Main\ORM\Objectify\EntityObject
Bitrix\Main\ORM\Objectify\EntityObject
```

## Смотрите также

- [DataManager::getObjectClass](get-object-class.md)
- [DataManager::getCollectionParentClass](get-collection-parent-class.md)
