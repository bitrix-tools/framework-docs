---
title: Добавить поле в выборку Query::addSelect
description: Метод Query::addSelect добавляет поле в выборку запроса, при необходимости под псевдонимом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::addSelect` добавляет поле в выборку. Прежние поля остаются.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function addSelect($definition, $alias = '')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| definition\* | `string` или `ExpressionField` | Задает поле в формате [setSelect](set-select.md) |
| alias | `string` | Задает псевдоним. По умолчанию — пустая строка, без псевдонима |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

Поле с тем же псевдонимом заменяет прежнее.

## Примеры

**Пример.** Код добавляет поле под псевдонимом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::query()->addSelect('LID')->addSelect('NAME', 'TITLE')->where('LID', 'en')->fetch();

echo implode(',', array_keys($row));
```

Код выведет `LID,TITLE`.

## Смотрите также

- [Query::setSelect](set-select.md)
