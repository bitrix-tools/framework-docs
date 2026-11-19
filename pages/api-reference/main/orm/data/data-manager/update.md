---
title: Изменить запись DataManager::update
description: Метод DataManager::update проверяет поля, отправляет события ORM и изменяет запись по первичному ключу. Метод возвращает UpdateResult.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::update` изменяет запись по первичному ключу и записывает только переданные поля. Перед записью метод отправляет событие `OnBeforeUpdate` и проверяет поля, затем отправляет `OnUpdate`, пишет изменения и отправляет `OnAfterUpdate`.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function update($primary, array $data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| primary\* | `mixed` | Задает первичный ключ, как в [getByPrimary](get-by-primary.md) |
| data\* | `array` | Задает новые значения полей, как в [add](add.md) |

Сигнатура PHP объявляет только тип `data`.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Data\UpdateResult`. В нем `isSuccess` возвращает `true`, если поля прошли проверку, а `getAffectedRowsCount` — число измененных строк.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Ключ неверный, например содержит неизвестное поле |
| `Bitrix\Main\DB\SqlQueryException` | База данных отклонила запрос |

## Особенности

- Существование записи не проверяется. Для несуществующего ключа `isSuccess` вернет `true`, а `getAffectedRowsCount` — `0`.
- Если массив `data` пустой, метод ничего не пишет и не отправляет `OnUpdate` и `OnAfterUpdate`. Событие `OnBeforeUpdate` метод отправляет, и его обработчики могут добавить ошибки в результат.
- Обязательное поле можно не передавать. Если `data` содержит пустое обязательное поле, метод вернет ошибку.
- Первичный ключ изменить нельзя. Метод пропускает новое значение ключа и выдает предупреждение `E_USER_WARNING`.
- Поля, которых нет в [getMap](get-map.md), пропускаются без ошибки.

## Примеры

**Пример.** Код изменяет запись и проверяет несуществующий ключ. Блок `finally` удаляет рабочую таблицу:

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
    $id = DemoUnitTable::add(['CODE' => 'kg', 'NAME' => 'Kilogram'])->getId();

    $result = DemoUnitTable::update($id, ['NAME' => 'Kilogram (SI)']);
    echo $result->getAffectedRowsCount() . ' ' . DemoUnitTable::getRowById($id)['NAME'] . "\n";

    $missing = DemoUnitTable::update(999, ['NAME' => 'Unknown']);
    echo var_export($missing->isSuccess(), true) . ' ' . $missing->getAffectedRowsCount();
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет:

```text
1 Kilogram (SI)
true 0
```

## Смотрите также

- [DataManager::updateMulti](update-multi.md)
- [DataManager::add](add.md)
