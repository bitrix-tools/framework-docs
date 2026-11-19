---
title: Получить поле типа значения ExpressionField::getValueField
description: Метод ExpressionField::getValueField возвращает объект скалярного поля, которое описывает тип значения выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::getValueField` возвращает объект скалярного поля, которое описывает тип значения выражения. Выражение приводит и преобразует значения через это поле.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function getValueField()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Fields\ScalarField`. ORM создает объект, когда привязывает выражение к сущности. До этого метод возвращает `null`, если метод [configureValueField](configure-value-field.md) не задал объект.

## Примеры

**Пример.** Код получает поле типа значения у выражения из запроса:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->registerRuntimeField(
    (new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME'))->configureValueType(IntegerField::class)
);
$valueField = $query->getEntity()->getField('NAME_LEN')->getValueField();

echo get_class($valueField) . ' ' . $valueField->getName();
```

Код выведет `Bitrix\Main\ORM\Fields\IntegerField NAME_LEN`.

## Смотрите также

- [ExpressionField::getValueType](get-value-type.md)
