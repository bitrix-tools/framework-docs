---
title: Проверить поле на NOT NULL ConditionTree::whereNotNull
description: Метод ConditionTree::whereNotNull добавляет условие IS NOT NULL для поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereNotNull` добавляет условие `IS NOT NULL` — поле заполнено. Вызов `where('FIELD', '<>', null)` дает тот же SQL.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNotNull($column)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Примеры

**Пример.** Код считает языки с заполненной культурой:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getCount(Query::filter()->whereNotNull('CULTURE_ID')) === LanguageTable::getCount() ? 'all filled' : 'some empty';
```

Код выведет `all filled`.

## Смотрите также

- [ConditionTree::whereNull](where-null.md)
