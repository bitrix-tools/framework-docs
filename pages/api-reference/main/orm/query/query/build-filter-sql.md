---
title: Построить SQL условия Query::buildFilterSql
description: Статический метод Query::buildFilterSql строит SQL условия WHERE по фильтру-массиву или дереву условий — для массовых UPDATE и DELETE.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.10

{% endnote %}

Статический метод `Query::buildFilterSql` строит SQL условия `WHERE` по фильтру. Условия обращаются к таблице по ее имени, без псевдонима, поэтому SQL подходит для запросов `UPDATE` и `DELETE` к этой таблице.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public static function buildFilterSql(Entity $entity, $filter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| entity\* | `Bitrix\Main\ORM\Entity` | Задает сущность |
| filter\* | `array` или `ConditionTree` | Задает фильтр-массив или дерево условий |

Тип `filter` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку условий без слова `WHERE`. Для пустого фильтра метод возвращает `null` и выдает предупреждение PHP.

## Особенности

Фильтр по полям связанных сущностей добавит в запрос соединения таблиц. Такой SQL нельзя использовать в `UPDATE` без соединений.

## Примеры

**Пример.** Код строит условие и подставляет его в `UPDATE`:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$where = Query::buildFilterSql(LanguageTable::getEntity(), Query::filter()->where('LID', 'ru'));
Application::getConnection()->query('UPDATE b_language SET SORT = SORT WHERE ' . $where);
LanguageTable::cleanCache();

echo $where;
```

Код выведет `` `b_language`.`LID` = 'ru' ``.

## Смотрите также

- [Query::setFilter](set-filter.md)
- [ConditionTree](../filter/condition-tree/index.md)
