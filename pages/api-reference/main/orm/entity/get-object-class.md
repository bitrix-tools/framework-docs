---
title: Получить класс объекта Entity::getObjectClass
description: Метод Entity::getObjectClass возвращает полное имя класса объекта сущности, например \Bitrix\Main\Localization\EO_Language.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getObjectClass` возвращает полное имя класса объекта сущности. Объекты этого класса возвращают `fetchObject` и [createObject](create-object.md). Класс задает [DataManager::getObjectClass](../data/data-manager/get-object-class.md). По умолчанию это `EO_<Сущность>` в пространстве имен таблицы.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getObjectClass()
```

## Возвращаемое значение

Метод возвращает имя класса с ведущим `\`.

## Примеры

**Пример.** Код читает класс объекта сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getObjectClass();
```

Код выведет `\Bitrix\Main\Localization\EO_Language`.

## Смотрите также

- [Entity::getObjectClassName](get-object-class-name.md)
- [Объекты](../../../../orm/objects.md)
