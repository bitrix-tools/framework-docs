---
title: Задать функции преобразования Result::setConverters
description: Метод Result::setConverters заменяет функции, которыми fetch преобразует значения колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setConverters` заменяет функции, которыми [fetch](fetch.md) преобразует значения колонок. Метод заменяет весь список, а не добавляет функции к нему.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function setConverters($converters)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| converters\* | `callable[]` | Задает функции в виде `имя колонки => функция`. Функция принимает значение колонки и возвращает новое значение. Пустой массив отключает преобразования, в том числе дат |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

Колонка из списка должна быть в каждой строке результата. Метод `fetch` передает функции значение `$data[имя колонки]` без проверки.

## Примеры

**Пример.** Код добавляет к стандартным преобразованиям функцию, которая приводит логин к верхнему регистру:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT LOGIN, DATE_REGISTER FROM ' . UserTable::getTableName() . ' ORDER BY ID',
    1
);

$converters = $result->getConverters();
$converters['LOGIN'] = static fn($value) => mb_strtoupper($value);
$result->setConverters($converters);

$row = $result->fetch();
echo $row['LOGIN'] . ' ' . get_class($row['DATE_REGISTER']);
```

## Смотрите также

- [Result::getConverters](get-converters.md)
- [Result::addFetchDataModifier](add-fetch-data-modifier.md)
