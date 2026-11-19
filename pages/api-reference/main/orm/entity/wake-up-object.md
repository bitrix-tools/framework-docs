---
title: Создать объект из данных Entity::wakeUpObject
description: Метод Entity::wakeUpObject создает объект сущности из готовых данных без запроса к базе данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::wakeUpObject` создает объект сущности из готовых данных, например из кеша или ответа другой системы. Метод не обращается к базе данных. ORM считает объект существующей записью — `save()` обновит ее, а не добавит новую. Метод работает как [DataManager::wakeUpObject](../data/data-manager/wake-up-object.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function wakeUpObject($row)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| row\* | `array` или скаляр | Задает данные записи — массив `поле => значение` с первичным ключом. Для ключа из одного поля можно передать само значение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект класса из [getObjectClass](get-object-class.md).

## Примеры

**Пример.** Код создает объект из массива:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$language = LanguageTable::getEntity()->wakeUpObject(['LID' => 'ru', 'NAME' => 'Russian']);

echo $language->getLid() . ' ' . $language->getName();
```

Код выведет `ru Russian`.

## Смотрите также

- [Entity::wakeUpCollection](wake-up-collection.md)
