---
title: Проверить значение поля связи Reference::validateValue
description: Метод Reference::validateValue проверяет, что значение поля связи — объект связанной сущности, и добавляет ошибку в результат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Reference::validateValue` проверяет значение поля связи. ORM вызывает метод, когда проверяет данные перед сохранением.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Relations\Reference`:

```php
public function validateValue($value, $primary, $row, Result $result)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает проверяемое значение |
| primary\* | `array`, `null` | Задает первичный ключ записи. Метод передает его в валидаторы поля |
| row\* | `array` | Задает данные записи. Метод передает их в валидаторы поля |
| result\* | `Bitrix\Main\ORM\Data\Result` | Задает результат, в который метод добавит ошибки |

Типы `value`, `primary` и `row` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект `result`. Если значение не `null` и не объект связанной сущности, метод добавляет в результат ошибку `Expected instance of ...`. Затем метод выполняет общую проверку `Field::validateValue` с валидаторами поля.

## Примеры

**Пример.** Код передает в поле связи объект `ArrayObject` вместо объекта связанной сущности и выводит ошибку:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Data\Result;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitGroupTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_unit_group';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))->configurePrimary(),
            new StringField('NAME'),
        ];
    }
}

$field = new Reference('GROUP', DemoUnitGroupTable::class, Join::on('this.GROUP_ID', 'ref.ID'));

$result = $field->validateValue(new ArrayObject(), null, [], new Result());

echo implode(', ', $result->getErrorMessages());
```

Код выведет ``Expected instance of `\EO_DemoUnitGroup`, got `ArrayObject` instead``. Класс `EO_DemoUnitGroup` — класс объекта, который ORM создает для сущности `DemoUnitGroupTable`.

## Смотрите также

- [Reference::getDataType](get-data-type.md)
