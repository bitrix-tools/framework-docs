---
title: Задать лимит объединения Query::setUnionLimit
description: Метод Query::setUnionLimit задает лимит записей всего результата UNION.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setUnionLimit` задает лимит записей всего результата объединения. Метод [setLimit](set-limit.md) действует только на первый запрос.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setUnionLimit($limit)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| limit\* | `int` | Задает число записей |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Примеры

**Пример.** Код ограничивает объединение одной записью:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])
    ->unionAll(LanguageTable::query()->setSelect(['LID']))
    ->setUnionLimit(1)
    ->fetchAll();

echo count($rows);
```

Код выведет `1`.

## Смотрите также

- [Query::setUnionOffset](set-union-offset.md)
