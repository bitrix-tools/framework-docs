---
title: Получить связи с сущностью Entity::getReferencesTo
description: Метод Entity::getReferencesTo возвращает поля Reference, которые связывают сущность с другой сущностью.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getReferencesTo` возвращает поля [Reference](../fields/relations/reference/index.md), которые связывают сущность с другой сущностью.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getReferencesTo($refEntityName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| refEntityName\* | `string` | Задает имя связанной сущности |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив полей `Reference` или пустой массив.

## Особенности

Метод ищет имя в нижнем регистре, а сущность хранит имена в исходном регистре. Поэтому для классов с заглавными буквами метод возвращает пустой массив. Подробнее — на странице [getReferencesCountTo](get-references-count-to.md).

## Примеры

**Пример.** Код запрашивает связи сущности пользователей с языками:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo count(UserTable::getEntity()->getReferencesTo('\Bitrix\Main\Localization\Language'));
```

Код выведет `0`, хотя у пользователей есть связь с языком.

## Смотрите также

- [Entity::getReferencesCountTo](get-references-count-to.md)
