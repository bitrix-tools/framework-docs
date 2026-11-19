---
title: Изменить несколько записей DataManager::updateMulti
description: Метод DataManager::updateMulti записывает одинаковые значения в несколько записей по списку первичных ключей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::updateMulti` записывает одинаковые значения в несколько записей. Метод сначала проверяет все записи и только потом пишет их в таблицу. Если значения после обработчиков событий одинаковы, метод выполняет один запрос `UPDATE`, иначе — запрос на каждую запись.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function updateMulti($primaries, $data, $ignoreEvents = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| primaries\* | `array` | Задает первичные ключи, например `[1, 2, 3]` |
| data\* | `array` | Задает значения полей `имя поля => значение` для всех записей |
| ignoreEvents | `bool` | Значение `true` отключает события ORM. По умолчанию — `false` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Data\UpdateResult`. Метод `getAffectedRowsCount` возвращает число измененных строк.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | В `data` есть поле, которого нет в таблице, или ключ неверный |
| `Bitrix\Main\SystemException` | В `data` есть поле первичного ключа |

## Особенности

- В отличие от [update](update.md), метод не поддерживает формат с ключом `fields` и не пропускает неизвестные поля.
- Для одного поля первичного ключа метод строит условие `IN (...)`, для составного ключа — условия через `OR`.
- Если запросы идут по одному, `getAffectedRowsCount` возвращает число строк только последнего запроса.
- Если массив `data` пустой, метод вернет ошибку с текстом `There is no data to add.`

## Примеры

**Пример.** Код задает одно название двум записям. Блок `finally` удаляет рабочую таблицу:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Data\DataManager;
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

DemoUnitTable::getEntity()->createDbTable();

try
{
    $first = DemoUnitTable::add(['CODE' => 'kg'])->getId();
    $second = DemoUnitTable::add(['CODE' => 'g'])->getId();

    $result = DemoUnitTable::updateMulti([$first, $second], ['NAME' => 'Metric']);

    echo $result->getAffectedRowsCount() . ' ' . DemoUnitTable::getCount(['=NAME' => 'Metric']);
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет `2 2`.

## Смотрите также

- [DataManager::update](update.md)
- [DataManager::addMulti](add-multi.md)
