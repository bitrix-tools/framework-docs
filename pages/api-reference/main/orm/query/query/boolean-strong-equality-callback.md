---
title: Построить сравнение с логическим значением Query::booleanStrongEqualityCallback
description: Служебный метод Query::booleanStrongEqualityCallback строит SQL сравнения выражения с true или false для старого фильтра-массива.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::booleanStrongEqualityCallback` строит SQL сравнения выражения с логическим значением — само выражение или `NOT` выражение. Запрос передает метод как обработчик в старый фильтр-массив для логических выражений. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function booleanStrongEqualityCallback($field, $operation, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает SQL выражения |
| operation\* | `string` | Задает операцию — `SE` для «равно», другое значение для «не равно» |
| value\* | `bool` | Задает логическое значение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку SQL — выражение без изменений или с префиксом `NOT `.

## Примеры

**Пример.** Код строит два сравнения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();

echo $query->booleanStrongEqualityCallback('`F`', 'SE', true) . ' / ' . $query->booleanStrongEqualityCallback('`F`', 'SN', true);
```

Код выведет `` `F` / NOT `F` ``.

## Смотрите также

- [Query::nullEqualityCallback](null-equality-callback.md)
