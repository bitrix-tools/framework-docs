---
title: Построить сравнение с NULL Query::nullEqualityCallback
description: Служебный метод Query::nullEqualityCallback строит SQL IS NULL или IS NOT NULL для старого фильтра-массива.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::nullEqualityCallback` строит SQL сравнения с `NULL` — `IS NULL` или `IS NOT NULL`. Запрос передает метод как обработчик в старый фильтр-массив. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function nullEqualityCallback($field, $operation, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает SQL поля |
| operation\* | `string` | Задает операцию — `SE` для `IS NULL`, другое значение для `IS NOT NULL` |
| value\* | `mixed` | Метод не использует значение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку SQL.

## Примеры

**Пример.** Код строит два сравнения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();

echo $query->nullEqualityCallback('`F`', 'SE', null) . ' / ' . $query->nullEqualityCallback('`F`', 'SN', null);
```

Код выведет `` `F` IS NULL / `F` IS NOT NULL ``.

## Смотрите также

- [Query::booleanStrongEqualityCallback](boolean-strong-equality-callback.md)
