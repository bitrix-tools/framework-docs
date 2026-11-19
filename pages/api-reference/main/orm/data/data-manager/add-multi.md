---
title: Добавить несколько записей DataManager::addMulti
description: Метод DataManager::addMulti добавляет несколько записей одним запросом INSERT или несколькими, если нужны события и автоинкремент.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::addMulti` добавляет несколько записей. Метод сначала проверяет все записи и только потом пишет их в таблицу. Если хотя бы одна запись не прошла проверку, метод не добавляет ни одной.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function addMulti($rows, $ignoreEvents = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| rows\* | `array[]` | Задает записи. Каждая запись — массив `имя поля => значение`, как в [add](add.md) |
| ignoreEvents | `bool` | Значение `true` отключает события ORM. По умолчанию — `false` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Data\AddResult`. Метод `isSuccess` возвращает `true`, если метод добавил все записи. Если записей больше одной, результат не содержит их идентификаторов, и метод `getId` возвращает `null`.

## Особенности

- Если записей нет, метод возвращает результат с ошибкой. Если запись одна, метод вызывает [add](add.md).
- Если у таблицы есть автоинкремент и события включены, метод выдает уведомление `E_USER_NOTICE` и добавляет записи отдельными запросами. Метод добавляет записи одним запросом `INSERT`, только если `ignoreEvents = true` или у таблицы нет автоинкремента.
- Отдельные запросы идут без транзакции. Ошибка базы данных посередине оставит часть записей в таблице.
- С `ignoreEvents = true` обработчики событий не узнают о новых записях.
- Метод не привязывает значения пользовательских полей `UF_*` к новым записям. Добавляйте записи с такими полями методом [add](add.md).

## Примеры

**Пример.** Код добавляет записи одним запросом без событий. Блок `finally` удаляет рабочую таблицу:

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
        ];
    }
}

DemoUnitTable::getEntity()->createDbTable();

try
{
    $result = DemoUnitTable::addMulti([['CODE' => 'kg'], ['CODE' => 'g'], ['CODE' => 't']], true);

    echo $result->isSuccess() . ' ' . DemoUnitTable::getCount();
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет `1 3`.

## Смотрите также

- [DataManager::add](add.md)
- [DataManager::updateMulti](update-multi.md)
