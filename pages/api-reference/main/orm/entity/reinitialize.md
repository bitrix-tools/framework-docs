---
title: Привязать сущность к другому классу Entity::reinitialize
description: Метод Entity::reinitialize привязывает копию сущности к другому классу таблицы — меняет класс и имя сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::reinitialize` привязывает сущность к другому классу таблицы. Метод меняет только класс и имя сущности, поля и таблица остаются прежними. Метод нужен при сложном наследовании таблиц. Код клонирует сущность родителя и привязывает копию к наследнику.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function reinitialize($className)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| className\* | `string` | Задает класс таблицы. Метод добавит суффикс `Table`, если его нет |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Вызывайте метод у копии сущности (`clone`). Иначе метод изменит общую сущность класса таблицы.

## Примеры

**Пример.** Код клонирует сущность и привязывает копию к другому классу:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$copy = clone LanguageTable::getEntity();
$copy->reinitialize('Vendor\Units\LangCopy');

echo $copy->getName() . ' ' . $copy->getDataClass() . ' ' . LanguageTable::getEntity()->getName();
```

Код выведет `LangCopy \Vendor\Units\LangCopyTable Language`.

## Смотрите также

- [Entity::initialize](initialize.md)
