---
title: Удалить запись DataManager::delete
description: Метод DataManager::delete отправляет события ORM и удаляет запись по первичному ключу вместе с ее пользовательскими полями.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::delete` удаляет запись по первичному ключу. Сначала он отправляет событие `OnBeforeDelete`, затем `OnDelete`, удаляет запись и ее пользовательские поля и отправляет `OnAfterDelete`. Обработчик `OnBeforeDelete` может запретить удаление, вернув ошибку.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function delete($primary)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| primary\* | `mixed` | Задает первичный ключ, как в [getByPrimary](get-by-primary.md) |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Data\DeleteResult`. В нем `isSuccess` возвращает `false`, если обработчик `OnBeforeDelete` вернул ошибку.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Ключ пустой или содержит неизвестное поле |
| `Bitrix\Main\DB\SqlQueryException` | База данных отклонила запрос, например запись связана внешним ключом |

## Особенности

- Существование записи не проверяется. Для несуществующего ключа `isSuccess` вернет `true`.
- Связанные записи других таблиц остаются без изменений.
- Обработчики событий без пространства имен получают только параметр `id`. Обработчики с пространством имен получают еще копию объекта записи, но только с первичным ключом.
- Чтобы обработчики получили значения полей, удаляйте объект методом `delete` объекта ORM. Он передает себя через [setCurrentDeletingObject](set-current-deleting-object.md). Метод `delete` объекта также применяет правила связей: обнуляет ссылки в записях `OneToMany` и удаляет записи промежуточной таблицы `ManyToMany`.

## Примеры

**Пример.** Код удаляет запись и проверяет, что ее больше нет. Блок `finally` удаляет рабочую таблицу:

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
    $id = DemoUnitTable::add(['CODE' => 'kg'])->getId();
    $result = DemoUnitTable::delete($id);

    echo var_export($result->isSuccess(), true) . ' ' . var_export(DemoUnitTable::getRowById($id), true);
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет `true NULL`.

## Смотрите также

- [DataManager::setCurrentDeletingObject](set-current-deleting-object.md)
- [Операции с сущностями и события](../../../../../orm/entity-operations.md)
