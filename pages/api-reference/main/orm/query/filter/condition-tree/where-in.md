---
title: Проверить вхождение в список ConditionTree::whereIn
description: Метод ConditionTree::whereIn добавляет условие IN со списком значений или подзапросом. Пустой список не добавляет условие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereIn` добавляет условие `IN` — значение поля входит в список. Список можно задать массивом, подзапросом `Query` или выражением `SqlExpression`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereIn($column, $values)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| values\* | `array`, `Bitrix\Main\ORM\Query\Query` или `Bitrix\Main\DB\SqlExpression` | Задает список значений или подзапрос с одним полем в `select` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

Если список пустой, метод не добавляет условие. Запрос вернет все записи, а не пустой результат. Проверяйте список до вызова, если пустой список должен давать пустой результат.

## Примеры

**Пример.** Код выбирает языки из списка и показывает поведение с пустым списком:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$selected = LanguageTable::getCount(Query::filter()->whereIn('LID', ['en']));
$empty = LanguageTable::getCount(Query::filter()->whereIn('LID', []));

echo $selected . ' ' . ($empty === LanguageTable::getCount() ? 'all rows' : 'no rows');
```

Код выведет `1 all rows`.

**Пример.** Код выбирает пользователей группы через подзапрос:

```php
<?php
use Bitrix\Main\ORM\Query\Query;
use Bitrix\Main\UserGroupTable;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$admins = UserGroupTable::query()->setSelect(['USER_ID'])->where('GROUP_ID', 1);

echo UserTable::getCount(Query::filter()->whereIn('ID', $admins)) > 0 ? 'admins found' : 'no admins';
```

Код выведет `admins found`.

## Смотрите также

- [ConditionTree::whereNotIn](where-not-in.md)
