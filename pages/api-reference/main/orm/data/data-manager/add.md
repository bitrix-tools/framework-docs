---
title: Добавить запись DataManager::add
description: Метод DataManager::add проверяет поля, отправляет события ORM и добавляет запись в таблицу. Метод возвращает AddResult с идентификатором или ошибками.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::add` добавляет запись в таблицу. Сначала метод заполняет значения по умолчанию, отправляет событие `OnBeforeAdd` и проверяет поля. Затем метод отправляет `OnAdd`, сохраняет запись и отправляет `OnAfterAdd`.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function add(array $data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `array` | Задает значения полей `имя поля => значение`. Другой формат — массив с ключами `fields` и `auth_context`, где `auth_context` — объект `Bitrix\Main\Authentication\Context` для проверки пользовательских полей |

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Data\AddResult`.

Методы результата:

- `isSuccess` — возвращает `true`, если запись добавлена,
- `getId` — возвращает идентификатор новой записи, `getPrimary` — первичный ключ массивом,
- `getErrors` — возвращает ошибки проверки, например `FieldError` с кодом `BX_EMPTY_REQUIRED` для пустого обязательного поля.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных отклонила запрос, например нарушен уникальный индекс |

## Особенности

- Метод пропускает поля, которых нет в [getMap](get-map.md), без ошибки.
- Если код не вызвал у результата с ошибками ни `isSuccess`, ни `getErrors`, ни `getErrorMessages`, объект результата при уничтожении выдает предупреждение PHP `E_USER_WARNING` с текстом ошибок.
- После записи метод очищает кеш выборок таблицы методом [cleanCache](clean-cache.md).
- Чтобы добавить запись через объект ORM, создайте его методом [createObject](create-object.md) и вызовите метод `save`.

## Примеры

**Пример.** Код создает рабочую таблицу, добавляет запись и пробует добавить запись без обязательного поля. Блок `finally` удаляет таблицу:

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
    $result = DemoUnitTable::add(['CODE' => 'kg', 'NAME' => 'Kilogram']);
    echo $result->isSuccess() . ' ' . $result->getId() . "\n";

    $result = DemoUnitTable::add(['NAME' => 'No code']);
    if (!$result->isSuccess())
    {
        echo $result->getErrors()[0]->getCode();
    }
}
finally
{
    Application::getConnection()->dropTable(DemoUnitTable::getTableName());
}
```

Код выведет:

```text
1 1
BX_EMPTY_REQUIRED
```

## Смотрите также

- [DataManager::addMulti](add-multi.md)
- [DataManager::checkFields](check-fields.md)
- [Операции с сущностями и события](../../../../../orm/entity-operations.md)
