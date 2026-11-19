---
title: Экранировать имя таблицы Query::quoteTableSource
description: Метод Query::quoteTableSource экранирует имя таблицы для SQL и оставляет подзапрос без изменений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::quoteTableSource` экранирует имя таблицы для SQL, например обратными кавычками в MySQL. Метод не меняет подзапрос в скобках `(SELECT ...)`. Запрос вызывает метод сам, когда строит `FROM`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function quoteTableSource($source)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| source\* | `string` | Задает имя таблицы или подзапрос |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код экранирует имя таблицы и подзапрос:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();

echo $query->quoteTableSource('b_language') . ' ' . $query->quoteTableSource('(SELECT 1)');
```

Для MySQL код выведет `` `b_language` (SELECT 1) ``.

## Смотрите также

- [Query::getQuery](get-query.md)
