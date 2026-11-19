---
title: Задать поле типа значения ExpressionField::configureValueField
description: Метод ExpressionField::configureValueField задает готовый объект скалярного поля, который описывает тип значения выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::configureValueField` задает готовый объект скалярного поля, который описывает тип значения выражения. Метод нужен, когда полю типа значения нужны настройки, например точность `FloatField` методом `configureScale`. Для простого типа достаточно [configureValueType](configure-value-type.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function configureValueField($field)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `Bitrix\Main\ORM\Fields\ScalarField` | Задает объект поля. Метод также задает тип значения по классу объекта |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ExpressionField`.

## Примеры

**Пример.** Код задает полю тип с округлением до двух знаков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\ORM\Fields\FloatField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->registerRuntimeField(
    (new ExpressionField('RATIO', '%s / 3', 'SORT'))->configureValueField((new FloatField('RATIO'))->configureScale(2))
);
$field = $query->getEntity()->getField('RATIO');

echo $field->getValueType() . ' ' . $field->cast('3.14159');
```

Код выведет `Bitrix\Main\ORM\Fields\FloatField 3.14`.

## Смотрите также

- [ExpressionField::configureValueType](configure-value-type.md)
- [ExpressionField::getValueField](get-value-field.md)
