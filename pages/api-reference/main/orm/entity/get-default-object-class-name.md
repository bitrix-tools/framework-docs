---
title: Получить имя класса объекта по умолчанию Entity::getDefaultObjectClassName
description: Статический метод Entity::getDefaultObjectClassName возвращает имя класса объекта по умолчанию — EO_ и имя сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::getDefaultObjectClassName` возвращает имя класса объекта по умолчанию — префикс `EO_` и имя сущности. Так называется класс, который ядро создает, если таблица не задала свой.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function getDefaultObjectClassName($entityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает короткое имя сущности |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку без пространства имен. Для пустого имени метод возвращает `EO_NNM_Object`.

## Примеры

**Пример.** Код строит имена классов объектов:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Entity::getDefaultObjectClassName('Unit') . ' ' . Entity::getDefaultObjectClassName('');
```

Код выведет `EO_Unit EO_NNM_Object`.

## Смотрите также

- [Entity::getDefaultCollectionClassName](get-default-collection-class-name.md)
- [Entity::compileObjectClass](compile-object-class.md)
