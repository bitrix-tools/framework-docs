---
title: Добавить несколько строк Connection::addMulti
description: Метод Connection::addMulti добавляет несколько строк в таблицу одним запросом INSERT.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::addMulti` добавляет несколько строк в таблицу одним запросом `INSERT`. Метод экранирует значения и преобразует их по типам колонок таблицы, как [add](add.md).

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function addMulti($tableName, $rows, $identity = "ID")
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| rows\* | `array[]` | Задает строки. Каждая строка — массив `имя колонки => значение`. Строки могут содержать разный набор колонок |
| identity | `string` | Метод не использует параметр. По умолчанию — `ID` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает результат [getInsertedId](get-inserted-id.md) после запроса.

Метод собирает список колонок из всех строк. Если в строке нет колонки, которая есть в другой строке, метод подставляет `DEFAULT`. Колонку, которой нет в таблице, метод пропускает и выдает предупреждение `E_USER_WARNING`.

Метод не делит строки на части. Настройки сервера базы данных ограничивают размер одного запроса.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\DuplicateEntryException` | Строка нарушила уникальность ключа. Класс наследует `SqlQueryException` |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код добавляет три строки одним запросом. У второй строки нет колонки `SORT`, и база данных подставит значение по умолчанию:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->createTable(
    'demo_api_units',
    [
        'ID' => new IntegerField('ID'),
        'CODE' => new StringField('CODE', ['size' => 20]),
        'SORT' => (new IntegerField('SORT'))->configureNullable(),
    ],
    ['ID'],
    ['ID']
);

try
{
    $connection->addMulti('demo_api_units', [
        ['CODE' => 'kg', 'SORT' => 10],
        ['CODE' => 'm'],
        ['CODE' => 'l', 'SORT' => 30],
    ]);

    echo $connection->queryScalar('SELECT COUNT(*) FROM demo_api_units');
}
finally
{
    $connection->dropTable('demo_api_units');
}
```

## Смотрите также

- [Connection::add](add.md)
