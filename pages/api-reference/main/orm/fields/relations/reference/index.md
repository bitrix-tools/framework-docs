---
title: Reference — связь с другой ORM-сущностью
description: Класс Bitrix\Main\ORM\Fields\Relations\Reference описывает в getMap связь «к одному» с другой ORM-сущностью и условие соединения таблиц.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Fields\Relations`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Поле `Reference` описывает в методе `getMap` связь записи с одной записью другой сущности, например единицы измерения с ее группой. Через такое поле запрос выбирает поля связанной сущности, например `'select' => ['GROUP.NAME']`, а объект ORM возвращает связанный объект.

Условие связи задают объектом `ConditionTree`, его строит метод [Join::on](../../../query/join/on.md). Префикс `this.` обозначает поле текущей сущности, `ref.` — поле связанной.

Связь «ко многим» описывает класс `Bitrix\Main\ORM\Fields\Relations\OneToMany`. Старое имя класса `Bitrix\Main\Entity\ReferenceField` работает как псевдоним.

Подробнее о связях — в статье [Связи между сущностями](../../../../../../orm/entity-relations.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает поле связи с именем, связанной сущностью и условием | |
| [getReference](get-reference.md) | Возвращает условие связи | |
| [getElementals](get-elementals.md) | Возвращает пары полей, которые связаны равенством | |
| [getDataType](get-data-type.md) | Возвращает имя связанной сущности | |
| [getTypeMask](get-type-mask.md) | Возвращает маску типа поля `FieldTypeMask::REFERENCE` | |
| [validateValue](validate-value.md) | Проверяет, что значение — объект связанной сущности | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `ELEMENTAL_THIS` | `1` | Флаг поля текущей сущности в условии, префикс `this.` |
| `ELEMENTAL_REF` | `2` | Флаг поля связанной сущности в условии, префикс `ref.` |
| `ELEMENTAL_BOTH` | `3` | Сумма флагов, условие связывает поле текущей сущности с полем связанной |

## Наследование

Класс наследует `Bitrix\Main\ORM\Fields\Relations\Relation`, тот — `Bitrix\Main\ORM\Fields\Field`.

### Унаследованные методы

Методы класса `Relation` работают для поля `Reference` без изменений:

- `configureJoinType` и `getJoinType` — тип соединения, по умолчанию `LEFT`, допустимые значения возвращает метод [Join::getTypes](../../../query/join/get-types.md),
- `getRefEntity` и `getRefEntityName` — связанная сущность и ее имя,
- `configureCascadeSavePolicy`, `getCascadeSavePolicy`, `configureCascadeDeletePolicy` и `getCascadeDeletePolicy` — правила каскадного сохранения и удаления.

Методы `getName`, `getTitle`, `configureTitle` и другие общие методы работают как в классе `Bitrix\Main\ORM\Fields\Field`.

## Смотрите также

- [Join](../../../query/join/index.md)
- [Связи между сущностями](../../../../../../orm/entity-relations.md)
