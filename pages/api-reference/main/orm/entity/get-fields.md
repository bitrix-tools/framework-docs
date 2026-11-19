---
title: Получить все поля Entity::getFields
description: Метод Entity::getFields возвращает все поля сущности — скалярные, выражения, связи и пользовательские поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getFields` возвращает все поля сущности — скалярные поля, выражения, связи и пользовательские поля `UF_*`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getFields()
```

## Возвращаемое значение

Метод возвращает массив `ИМЯ ПОЛЯ => объект поля`. Ключи — имена в верхнем регистре.

## Примеры

**Пример.** Код выводит классы полей сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

foreach (array_slice(LanguageTable::getEntity()->getFields(), 0, 3) as $name => $field)
{
    echo $name . ' ' . (new \ReflectionClass($field))->getShortName() . "\n";
}
```

Код выведет:

```text
LID StringField
ID ExpressionField
LANGUAGE_ID ExpressionField
```

## Смотрите также

- [Entity::getScalarFields](get-scalar-fields.md)
- [Entity::getField](get-field.md)
