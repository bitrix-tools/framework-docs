---
title: Прочитать настройки таблицы Entity::initialize
description: Метод Entity::initialize читает из класса таблицы имя таблицы, соединение, описание полей и настройки пользовательских полей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::initialize` читает настройки из класса таблицы — соединение, имя таблицы, описание полей из `getMap` и настройки пользовательских полей. Метод еще не создает поля — это делает [postInitialize](post-initialize.md).

Метод [getInstance](get-instance.md) вызывает его сам. Прикладному коду вызывать метод не нужно. Свой класс сущности может переопределить метод, чтобы прочитать дополнительные настройки.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function initialize($className)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| className\* | `string` | Задает класс таблицы — наследник `DataManager` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код создает сущность вручную и читает класс таблицы:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = new Entity();
$entity->initialize(LanguageTable::class);

echo $entity->getDataClass() . ' ' . $entity->getDBTableName();
```

Код выведет `Bitrix\Main\Localization\LanguageTable b_language`.

## Смотрите также

- [Entity::postInitialize](post-initialize.md)
- [Entity::getInstance](get-instance.md)
