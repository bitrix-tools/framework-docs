---
title: Получить сущность DataManager::getEntity
description: Метод DataManager::getEntity возвращает объект сущности ORM с описанием полей, таблицы и подключения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getEntity` возвращает сущность ORM — объект `Bitrix\Main\ORM\Entity` с полями из [getMap](get-map.md), именем таблицы и подключением. Сущность нужна, чтобы получить поля, создать запрос `Query` или таблицу в базе данных.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getEntity()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Entity` или класса из [getEntityClass](get-entity-class.md). Метод создает сущность при первом вызове и затем возвращает тот же объект.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Описание полей в `getMap` неверное |
| `Bitrix\Main\SystemException` | ORM не смогла создать сущность, например в `getMap` нет первичного ключа |

## Примеры

**Пример.** Код читает сведения из сущности таблицы языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();

echo $entity->getName() . ' ' . $entity->getDBTableName() . ' ' . implode(',', $entity->getPrimaryArray());
```

Код выведет `Language b_language LID`.

## Смотрите также

- [DataManager::getMap](get-map.md)
- [DataManager::unsetEntity](unset-entity.md)
