---
title: Проверить значения полей DataManager::checkFields
description: Метод DataManager::checkFields проверяет обязательные поля и валидаторы и записывает ошибки в объект результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::checkFields` проверяет значения полей перед записью. Метод проверяет обязательные поля и запускает валидаторы полей, например `LengthValidator`. Метод записывает ошибки в объект результата. Методы [add](add.md) и [update](update.md) вызывают его сами.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function checkFields(Result $result, $primary, array $data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| result\* | `Bitrix\Main\ORM\Data\Result` | Задает объект, в который метод запишет ошибки |
| primary\* | `mixed` | Задает первичный ключ изменяемой записи. Для новой записи — `null` |
| data\* | `array` | Задает значения полей `имя поля => значение` |

Сигнатура PHP объявляет типы `result` и `data`.

## Возвращаемое значение

Метод ничего не возвращает. Метод `getErrors` объекта `result` возвращает ошибки.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | В `data` есть поле, которого нет в таблице |

## Особенности

- Для новой записи (`primary = null`) метод требует все обязательные поля.
- Для изменения записи метод проверяет обязательное поле, только если оно есть в `data`.

## Примеры

**Пример.** Код проверяет данные новой записи без обязательного поля:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Data\Result;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_api_units';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))->configurePrimary()->configureAutocomplete(),
            (new StringField('CODE'))->configureRequired(),
            new StringField('NAME'),
        ];
    }
}

$result = new Result();
DemoUnitTable::checkFields($result, null, ['NAME' => 'Kilogram']);

foreach ($result->getErrors() as $error)
{
    echo $error->getField()->getName() . ' ' . $error->getCode();
}
```

Код выведет `CODE BX_EMPTY_REQUIRED`.

## Смотрите также

- [DataManager::add](add.md)
- [LengthValidator](../../fields/validators/length-validator/index.md)
