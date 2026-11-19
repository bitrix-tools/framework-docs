---
title: Удалить сущность из памяти Entity::destroy
description: Статический метод Entity::destroy удаляет сущность из памяти, чтобы следующий вызов построил ее заново.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::destroy` удаляет сущность из внутреннего хранилища класса `Entity` и класса таблицы. Следующий вызов [get](get.md) или `getEntity` построит сущность заново. Ядро вызывает метод, когда меняются пользовательские поля сущности.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function destroy($entity)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entity\* | `Entity` или `string` | Задает сущность объектом или именем |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если удалил сущность, и `false`, если сущности в памяти не было.

## Особенности

Метод не удаляет класс таблицы и таблицу в базе данных.

## Примеры

**Пример.** Код удаляет сущность из памяти дважды:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();

var_dump(Entity::destroy($entity), Entity::destroy('Bitrix\Main\Localization\Language'), LanguageTable::getEntity() === $entity);
```

Код выведет:

```text
bool(true)
bool(false)
bool(false)
```

## Смотрите также

- [Entity::getInstance](get-instance.md)
- [DataManager::unsetEntity](../data/data-manager/unset-entity.md)
