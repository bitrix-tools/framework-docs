---
title: Добавить полнотекстовый поиск с отрицанием ConditionTree::whereNotMatch
description: Метод ConditionTree::whereNotMatch добавляет условие NOT MATCH AGAINST — полнотекстовый поиск не находит запись.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 17.5.5

{% endnote %}

Метод `ConditionTree::whereNotMatch` добавляет полнотекстовый поиск с отрицанием `NOT MATCH ... AGAINST`. Правила те же, что в [whereMatch](where-match.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNotMatch($column, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| value\* | `string` | Задает строку поиска |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

Для поиска колонка таблицы должна иметь полнотекстовый индекс.

## Примеры

**Пример.** Код строит запрос с отрицанием поиска и проверяет SQL без выполнения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$sql = LanguageTable::query()
    ->setSelect(['LID'])
    ->whereNotMatch('NAME', 'rus*')
    ->getQuery();

echo str_contains($sql, 'NOT MATCH') ? 'not match query' : 'other';
```

На сайте с MySQL код выведет `not match query`.

## Смотрите также

- [ConditionTree::whereMatch](where-match.md)
