---
title: Создать коллекцию существующих записей DataManager::wakeUpCollection
description: Метод DataManager::wakeUpCollection создает коллекцию объектов существующих записей по первичным ключам без запроса к базе данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::wakeUpCollection` создает коллекцию объектов для записей, которые уже есть в базе данных. Метод не выполняет запрос. Метод `fill` коллекции загружает недостающие значения одним запросом.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
final public static function wakeUpCollection($rows)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| rows\* | `array` | Задает записи. Элемент — первичный ключ или массив значений с ключом, как в [wakeUpObject](wake-up-object.md) |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает коллекцию класса из [getCollectionClass](get-collection-class.md).

## Примеры

**Пример.** Код создает коллекцию языков по ключам и загружает названия:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$languages = LanguageTable::wakeUpCollection(['en', 'ru']);
$languages->fill(['NAME']);

echo implode(',', $languages->getNameList());
```

Код выведет `English,Russian`.

## Смотрите также

- [DataManager::wakeUpObject](wake-up-object.md)
- [Коллекции](../../../../../orm/collections.md)
