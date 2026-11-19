---
title: Добавить строку Connection::add
description: Метод Connection::add добавляет строку в таблицу, экранирует значения по типам колонок и возвращает идентификатор строки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::add` добавляет строку в таблицу и возвращает ее идентификатор. Метод экранирует значения и преобразует их по типам колонок таблицы. Для таблиц ORM-классов используйте метод `add` ORM-класса. Он проверяет поля и вызывает события.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function add($tableName, array $data, $identity = "ID")
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| data\* | `array` | Задает значения колонок в виде `имя колонки => значение`. Регистр имени не важен. Колонку, которой нет в таблице, метод пропускает и выдает предупреждение `E_USER_WARNING` |
| identity | `string`, `null` | Задает имя автоинкрементной колонки. По умолчанию — `ID`. Учитывает только PostgreSQL. Для таблицы без автоинкремента передайте `null` |

Типы `tableName` и `identity` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Результат зависит от реализации.

| Реализация | Что возвращает |
| --- | --- |
| `MysqliConnection` | Результат [getInsertedId](get-inserted-id.md) — значение автоинкремента добавленной строки |
| `PgsqlConnection` | Если `identity` не `null` и в `data` нет значения этой колонки или значение — объект `SqlExpression`, метод добавляет строку с `RETURNING` и возвращает новое значение колонки целым числом. Иначе метод возвращает `data[identity]` или `null` |

Метод читает описание колонок через [getTableFields](get-table-fields.md), поэтому таблица должна существовать.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\DuplicateEntryException` | Строка нарушила уникальность ключа. Класс наследует `SqlQueryException` |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код создает рабочую таблицу с автоинкрементом, добавляет строку и выводит ее идентификатор. Блок `finally` удаляет таблицу:

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
    ],
    ['ID'],
    ['ID']
);

try
{
    $id = $connection->add('demo_api_units', ['CODE' => "kg'"]);
    echo $id;
}
finally
{
    $connection->dropTable('demo_api_units');
}
```

Метод сам экранировал апостроф в значении `kg'`.

## Смотрите также

- [Connection::addMulti](add-multi.md)
- [Connection::getInsertedId](get-inserted-id.md)
