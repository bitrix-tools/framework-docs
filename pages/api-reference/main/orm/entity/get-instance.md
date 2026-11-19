---
title: Получить сущность Entity::getInstance
description: Статический метод Entity::getInstance возвращает сущность ORM по имени и создает ее при первом обращении.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::getInstance` возвращает сущность ORM по имени. При первом обращении метод создает сущность.

1. Приводит имя к классу таблицы методом [normalizeEntityClass](normalize-entity-class.md).
2. Создает объект класса из `DataManager::getEntityClass` и вызывает [initialize](initialize.md) и [postInitialize](post-initialize.md).
3. Вызывает `postInitialize` класса таблицы, если наследник его переопределил.

Следующие вызовы возвращают тот же объект.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function getInstance($entityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает имя сущности или класса таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Entity`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Error` | Класса таблицы нет |
| `Bitrix\Main\SystemException` | У таблицы с полями нет первичного ключа |
| `Bitrix\Main\ArgumentException` | Описание поля содержит неизвестный тип |

## Примеры

**Пример.** Код получает сущность по имени класса таблицы:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::getInstance('\Bitrix\Main\Localization\LanguageTable');

echo $entity->getName() . ' ' . var_export($entity === Entity::get('Bitrix\Main\Localization\Language'), true);
```

Код выведет `Language true`.

## Смотрите также

- [Entity::get](get.md)
- [Entity::destroy](destroy.md)
