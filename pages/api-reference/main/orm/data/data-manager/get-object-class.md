---
title: Получить класс объекта DataManager::getObjectClass
description: Метод DataManager::getObjectClass возвращает полное имя класса объекта ORM таблицы, например EO_User. Наследник переопределяет его, чтобы задать свой класс.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getObjectClass` возвращает полное имя класса, объекты которого возвращают `fetchObject` и [createObject](create-object.md). Наследник переопределяет метод, чтобы задать свой класс объекта с дополнительными методами. Свой класс наследуют от класса из [getObjectParentClass](get-object-parent-class.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getObjectClass()
```

## Возвращаемое значение

Метод возвращает имя класса. Если наследник не переопределил метод, ORM берет имя класса таблицы без суффикса `Table` и добавляет префикс `EO_`. Пространство имен остается тем же. Имя начинается с `\`.

## Особенности

ORM создает класс по умолчанию сама, когда к нему обращаются. Команда `orm:annotate` описывает классы для подсказок в редакторе кода.

## Примеры

**Пример.** Код выводит класс объекта таблицы языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getObjectClass();
```

Код выведет `\Bitrix\Main\Localization\EO_Language`.

## Смотрите также

- [DataManager::getObjectClassName](get-object-class-name.md)
- [Аннотации классов](../../../../../orm/annotations.md)
