---
title: Получить сущность Entity::get
description: Статический метод Entity::get возвращает сущность ORM по имени сущности или класса таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Entity::get` возвращает сущность ORM по имени. Имя можно передать с суффиксом `Table` или без него — `Bitrix\Main\Localization\Language` и `Bitrix\Main\Localization\LanguageTable` дают одну и ту же сущность. Метод вызывает [getInstance](get-instance.md).

Если класс таблицы известен, вызывайте [DataManager::getEntity](../data/data-manager/get-entity.md) — результат тот же.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public static function get($entityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entityName\* | `string` | Задает имя сущности или класса таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Entity`. Объект один на класс таблицы.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Error` | Класса таблицы нет |
| `Bitrix\Main\ArgumentException`, `Bitrix\Main\SystemException` | Описание полей таблицы содержит ошибку |

## Примеры

**Пример.** Код получает сущность по имени и сравнивает с результатом `getEntity`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::get('Bitrix\Main\Localization\Language');

echo $entity->getDBTableName() . ' ' . var_export($entity === LanguageTable::getEntity(), true);
```

Код выведет `b_language true`.

## Смотрите также

- [Entity::getInstance](get-instance.md)
- [DataManager::getEntity](../data/data-manager/get-entity.md)
