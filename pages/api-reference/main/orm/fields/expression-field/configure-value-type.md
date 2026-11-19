---
title: Задать тип значения ExpressionField::configureValueType
description: Метод ExpressionField::configureValueType задает класс скалярного поля, по которому ORM приводит значение выражения к типу.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::configureValueType` задает класс скалярного поля, которое описывает тип значения выражения, например `IntegerField` или `FloatField`. Метод [cast](cast.md) приводит значение по этому полю, а `fetchObject` возвращает значение нужного типа.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function configureValueType($class)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| class\* | `string` | Задает имя класса скалярного поля, например `IntegerField::class` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ExpressionField`.

## Особенности

- Вызывайте метод до того, как поле попадет в запрос. ORM создает поле типа значения один раз, когда привязывает выражение к сущности.
- Метод `fetch` результата возвращает значение выражения так, как его вернул драйвер, для MySQL и PostgreSQL — строкой. Методы `fetchObject` и `fetchCollection` приводят значение к этому типу. Условие фильтра по выражению тоже использует этот тип.
- Если класс — не скалярное поле, при привязке к сущности ORM выбросит `Bitrix\Main\SystemException`.

## Примеры

**Пример.** Код задает целый тип длине названия и читает значение объектом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$language = LanguageTable::getList([
    'select' => ['LID', 'NAME_LEN'],
    'filter' => ['=LID' => 'en'],
    'runtime' => [
        (new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME'))->configureValueType(IntegerField::class),
    ],
])->fetchObject();

var_dump($language->get('NAME_LEN'));
```

Код выведет `int(7)`.

## Смотрите также

- [ExpressionField::configureValueField](configure-value-field.md)
- [ExpressionField::getValueType](get-value-type.md)
