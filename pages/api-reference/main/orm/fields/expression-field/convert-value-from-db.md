---
title: Преобразовать значение из базы данных ExpressionField::convertValueFromDb
description: Метод ExpressionField::convertValueFromDb преобразует значение из базы данных через поле типа значения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::convertValueFromDb` преобразует значение, которое вернула база данных, в значение PHP. Метод вызывает `convertValueFromDb` поля типа значения. Например, для `DatetimeField` метод превращает строку в объект `DateTime`.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function convertValueFromDb($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение из базы данных |

## Возвращаемое значение

Метод возвращает значение, приведенное к типу поля типа значения.

## Особенности

Метод работает только после привязки поля к сущности.

## Примеры

**Пример.** Код преобразует строку даты из базы данных:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\DatetimeField;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->registerRuntimeField(
    (new ExpressionField('NOW_AT', 'NOW()'))->configureValueType(DatetimeField::class)
);
$value = $query->getEntity()->getField('NOW_AT')->convertValueFromDb('2026-11-11 10:00:00');

echo get_class($value);
```

Код выведет `Bitrix\Main\Type\DateTime`.

## Смотрите также

- [ExpressionField::convertValueToDb](convert-value-to-db.md)
- [ExpressionField::cast](cast.md)
