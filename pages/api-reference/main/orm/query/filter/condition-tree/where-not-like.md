---
title: Проверить несовпадение с шаблоном ConditionTree::whereNotLike
description: Метод ConditionTree::whereNotLike добавляет условие NOT LIKE. Метод не добавляет символы % сам.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereNotLike` добавляет условие `NOT ... LIKE` — значение поля не совпадает с шаблоном. Правила шаблона те же, что в [whereLike](where-like.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNotLike($column, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| value\* | `string` | Задает шаблон |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

Условие не находит записи, у которых поле равно `NULL`.

## Примеры

**Пример.** Код выбирает языки, название которых не начинается на `Eng`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereNotLike('NAME', 'Eng%'),
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru`.

## Смотрите также

- [ConditionTree::whereLike](where-like.md)
