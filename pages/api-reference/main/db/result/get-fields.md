---
title: Получить описание колонок результата Result::getFields
description: Метод Result::getFields возвращает колонки результата запроса в виде объектов полей ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.2

{% endnote %}

Метод `Result::getFields` возвращает колонки результата в виде объектов полей ORM, например `IntegerField` или `DatetimeField`. По этим объектам результат выбирает функции преобразования значений.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
abstract public function getFields();
```

## Возвращаемое значение

Метод возвращает массив `имя колонки => объект`, где объект — наследник `Bitrix\Main\ORM\Fields\ScalarField`. Класс объекта зависит от типа колонки в базе данных. Метод запоминает массив в объекте результата.

| Реализация | Ключи массива |
| --- | --- |
| `MysqliResult` | Имена колонок, как в результате. Если у объекта результата нет соединения, метод возвращает пустой массив |
| `PgsqlResult` | Имена колонок в верхнем регистре. Если у объекта результата нет соединения, метод возвращает пустой массив |
| `ArrayResult` | Метод возвращает `null` |

## Примеры

**Пример.** Код выводит тип поля для каждой колонки результата:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID, LOGIN, DATE_REGISTER FROM ' . UserTable::getTableName(),
    1
);

foreach ($result->getFields() as $name => $field)
{
    echo $name . ' — ' . get_class($field) . PHP_EOL;
}
```

## Смотрите также

- [Result::getFieldsCount](get-fields-count.md)
- [Result::getConverters](get-converters.md)
- [Connection::getTableFields](../connection/get-table-fields.md)
