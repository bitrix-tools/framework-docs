---
title: Получить поля выражения ExpressionField::getBuildFrom
description: Метод ExpressionField::getBuildFrom возвращает список полей, которые ORM подставляет в выражение вместо %s.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::getBuildFrom` возвращает список полей, которые ORM подставляет в выражение вместо `%s` по порядку.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function getBuildFrom()
```

## Возвращаемое значение

Метод возвращает массив. Элемент — имя поля, например `NAME`, цепочка через связь, например `GROUPS.GROUP_ID`, или функция, которая возвращает `SqlExpression`. Если конструктор получил одну строку, метод возвращает массив из одного элемента. Если полей нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код выводит поля выражения:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$single = new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME');
$pair = new ExpressionField('TOTAL', '%s * %s', ['PRICE', 'QUANTITY']);

echo implode(',', $single->getBuildFrom()) . ' ' . implode(',', $pair->getBuildFrom());
```

Код выведет `NAME PRICE,QUANTITY`.

## Смотрите также

- [ExpressionField::getBuildFromChains](get-build-from-chains.md)
- [ExpressionField::isConstant](is-constant.md)
