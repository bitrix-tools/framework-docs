---
title: Привести значение к типу ExpressionField::cast
description: Метод ExpressionField::cast приводит значение к типу выражения через поле типа значения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::cast` приводит значение к типу выражения. Метод вызывает `cast` поля типа значения, например `IntegerField::cast` превращает строку `'7'` в число `7`. Метод `fetchObject` вызывает его для каждого значения выражения.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function cast($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение |

## Возвращаемое значение

Метод возвращает значение, приведенное к типу поля типа значения.

## Особенности

До привязки к сущности ORM не создает поле типа значения. Если вызвать метод раньше и не задать поле через [configureValueField](configure-value-field.md), метод выбросит `Error`.

## Примеры

**Пример.** Код приводит строку к целому числу:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->registerRuntimeField(
    (new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME'))->configureValueType(IntegerField::class)
);

var_dump($query->getEntity()->getField('NAME_LEN')->cast('7'));
```

Код выведет `int(7)`.

## Смотрите также

- [ExpressionField::configureValueType](configure-value-type.md)
- [ExpressionField::convertValueFromDb](convert-value-from-db.md)
