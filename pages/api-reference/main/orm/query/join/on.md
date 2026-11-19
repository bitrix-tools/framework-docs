---
title: Создать условие связи Join::on
description: Метод Join::on создает условие связи ORM, которое сравнивает поле с другим полем.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Join::on` создает объект условия и добавляет в него сравнение двух полей. Метод — короткая запись для `(new ConditionTree())->whereColumn(...)`. Объект условия передают в конструктор поля [Reference](../../fields/relations/reference/index.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Join`:

```php
public static function on()
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

Метод принимает аргументы в форме `(column, value)` или `(column, operator, value)`.

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает поле, например `this.GROUP_ID`. Префикс `this.` обозначает текущую сущность, `ref.` — связанную |
| operator | `string` | Задает оператор сравнения, например `=` или `>`. В форме из двух аргументов метод использует `=` |
| value\* | `string` | Задает второе поле, например `ref.ID`. Метод считает значение именем поля, а не строкой |

Сигнатура PHP не объявляет параметры. Метод читает их через `func_get_args`.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Query\Filter\ConditionTree`. Методы `where`, `whereColumn`, `whereNull` и другие добавляют к нему условия.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Передано не два и не три аргумента или оператор неизвестен |

## Примеры

**Пример.** Код строит условие связи единицы измерения с активной группой и выводит число условий:

```php
<?php
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$condition =
    Join::on('this.GROUP_ID', 'ref.ID')
        ->where('ref.ACTIVE', 'Y')
;

echo count($condition->getConditions());
```

Код выведет `2`.

## Смотрите также

- [Join::getTypes](get-types.md)
- [Reference::__construct](../../fields/relations/reference/construct.md)
