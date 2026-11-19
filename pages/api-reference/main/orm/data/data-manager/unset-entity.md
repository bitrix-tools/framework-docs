---
title: Удалить сущность из памяти класса DataManager::unsetEntity
description: Метод DataManager::unsetEntity удаляет запомненную сущность из памяти класса DataManager.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::unsetEntity` удаляет сущность, которую запомнил [getEntity](get-entity.md), из памяти класса. Прикладному коду метод нужен редко.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function unsetEntity($class)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| class\* | `string` | Задает имя класса таблицы, например `LanguageTable::class` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод не пересоздает сущность. Класс `Entity` хранит свой экземпляр отдельно, поэтому следующий вызов `getEntity` вернет тот же объект. Чтобы построить сущность заново, вызовите [Entity::destroy](../../entity/destroy.md). Он удаляет сущность из обоих хранилищ.

## Примеры

**Пример.** Код удаляет сущность из памяти класса и получает ее снова:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$before = LanguageTable::getEntity();
LanguageTable::unsetEntity(LanguageTable::class);

var_dump($before === LanguageTable::getEntity());
```

Код выведет `bool(true)`.

## Смотрите также

- [DataManager::getEntity](get-entity.md)
- [Entity::destroy](../../entity/destroy.md)
