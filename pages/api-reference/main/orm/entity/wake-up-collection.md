---
title: Создать коллекцию из данных Entity::wakeUpCollection
description: Метод Entity::wakeUpCollection создает коллекцию объектов сущности из готовых данных без запроса к базе данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::wakeUpCollection` создает коллекцию объектов из готовых данных без запроса к базе данных. Метод работает как [DataManager::wakeUpCollection](../data/data-manager/wake-up-collection.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function wakeUpCollection($rows)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| rows\* | `array` | Задает данные записей — массив строк в формате [wakeUpObject](wake-up-object.md) |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает коллекцию класса из [getCollectionClass](get-collection-class.md).

## Примеры

**Пример.** Код создает коллекцию из двух записей:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$collection = LanguageTable::getEntity()->wakeUpCollection([['LID' => 'ru'], ['LID' => 'en']]);

echo count($collection) . ' ' . implode(',', $collection->getLidList());
```

Код выведет `2 ru,en`.

## Смотрите также

- [Entity::wakeUpObject](wake-up-object.md)
