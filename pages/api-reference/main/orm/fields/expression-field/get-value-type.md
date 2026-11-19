---
title: Получить класс типа значения ExpressionField::getValueType
description: Метод ExpressionField::getValueType возвращает имя класса скалярного поля, которое описывает тип значения выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::getValueType` возвращает имя класса скалярного поля, которое описывает тип значения выражения.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function getValueType()
```

## Возвращаемое значение

Метод возвращает имя класса, например `Bitrix\Main\ORM\Fields\IntegerField`. Если тип не задан, метод возвращает `Bitrix\Main\ORM\Fields\StringField`.

При старом формате с параметром `data_type` в конструкторе метод возвращает `null`, пока поле не привязано к сущности.

## Примеры

**Пример.** Код сравнивает тип по умолчанию и заданный тип:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$default = new ExpressionField('CNT', 'COUNT(*)');
$typed = (new ExpressionField('CNT', 'COUNT(*)'))->configureValueType(IntegerField::class);

echo $default->getValueType() . "\n" . $typed->getValueType();
```

Код выведет:

```text
Bitrix\Main\ORM\Fields\StringField
Bitrix\Main\ORM\Fields\IntegerField
```

## Смотрите также

- [ExpressionField::configureValueType](configure-value-type.md)
- [ExpressionField::getValueField](get-value-field.md)
