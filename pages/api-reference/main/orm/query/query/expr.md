---
title: Создать выражение Query::expr
description: Статический метод Query::expr возвращает помощник, который создает ExpressionField с агрегатной функцией — COUNT, SUM, MIN, MAX, AVG.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Query::expr` возвращает помощник `Bitrix\Main\ORM\Query\Expression`. Помощник создает [ExpressionField](../../fields/expression-field/index.md) с функцией в одну строку, например `Query::expr('CNT')->count('ID')`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public static function expr($alias = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| alias | `string` или `null` | Задает имя поля выражения. По умолчанию — `null`, тогда помощник создаст имя сам |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Expression`. Методы помощника — `count`, `countDistinct`, `sum`, `min`, `max`, `avg`, `concat`, `lower`, `upper`, `length` — возвращают `ExpressionField`.

## Особенности

Помощник один на все вызовы. Задавайте имя при каждом вызове, иначе метод сбросит его в `null`.

## Примеры

**Пример.** Код считает языки выражением:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::query()->setSelect([Query::expr('CNT')->count('LID')])->fetch();

echo $row['CNT'];
```

Код выведет число языков, например `2`.

## Смотрите также

- [ExpressionField](../../fields/expression-field/index.md)
- [Query::setGroup](set-group.md)
