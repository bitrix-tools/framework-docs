---
title: Преобразовать значение для базы данных ExpressionField::convertValueToDb
description: Метод ExpressionField::convertValueToDb преобразует значение в строку SQL через поле типа значения, например для фильтра по выражению.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::convertValueToDb` преобразует значение в строку для SQL-запроса. Метод вызывает `convertValueToDb` поля типа значения. Запрос использует метод, когда строит условие фильтра по выражению.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function convertValueToDb($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение |

## Возвращаемое значение

Метод возвращает строку для подстановки в SQL, например число или строку в кавычках.

## Особенности

Метод работает только после привязки поля к сущности.

## Примеры

**Пример.** Код преобразует значение для целого и строкового типа:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()
    ->registerRuntimeField((new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME'))->configureValueType(IntegerField::class))
    ->registerRuntimeField(new ExpressionField('NAME_UP', 'UPPER(%s)', 'NAME'));

$entity = $query->getEntity();

echo $entity->getField('NAME_LEN')->convertValueToDb('7') . ' ' . $entity->getField('NAME_UP')->convertValueToDb('kg');
```

Код выведет `7 'kg'`.

## Смотрите также

- [ExpressionField::convertValueFromDb](convert-value-from-db.md)
