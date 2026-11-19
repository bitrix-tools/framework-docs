---
title: Проверить поле на NULL ConditionTree::whereNull
description: Метод ConditionTree::whereNull добавляет условие IS NULL для поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereNull` добавляет условие `IS NULL` — поле не заполнено. Вызов `where('FIELD', null)` дает тот же SQL.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNull($column)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля, например `PERSONAL_PHONE` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

Пустая строка — не `NULL`. Чтобы найти и пустые строки, объедините условие с `where('FIELD', '')` через логику `or`.

## Примеры

**Пример.** Код считает языки без культуры:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getCount(Query::filter()->whereNull('CULTURE_ID'));
```

Код выведет `0`.

## Смотрите также

- [ConditionTree::whereNotNull](where-not-null.md)
