---
title: Добавить обработку строки Result::addFetchDataModifier
description: Метод Result::addFetchDataModifier добавляет функцию, которую fetch вызывает для каждой строки результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Result::addFetchDataModifier` добавляет функцию, которую [fetch](fetch.md) вызывает для каждой строки результата. Функция может изменить строку, добавить или удалить колонки.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function addFetchDataModifier($fetchDataModifier)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fetchDataModifier\* | `callable` | Задает функцию. Функция получает строку по ссылке и меняет ее либо возвращает новый массив строки |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

Метод `fetch` вызывает функции в порядке добавления. Страница [fetch](fetch.md) показывает, на каком шаге метод вызывает эти функции. Если функция вернула массив, `fetch` использует его как новую строку. Иначе `fetch` оставляет строку, которую функция изменила по ссылке.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Значение `fetchDataModifier` нельзя вызвать как функцию |

## Примеры

**Пример.** Код добавляет в строку колонку с полным именем пользователя:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID, NAME, LAST_NAME FROM ' . UserTable::getTableName() . ' ORDER BY ID',
    3
);

$result->addFetchDataModifier(static function (array $row): array
{
    $row['FULL_NAME'] = trim($row['NAME'] . ' ' . $row['LAST_NAME']);

    return $row;
});

while ($row = $result->fetch())
{
    echo $row['ID'] . ': ' . $row['FULL_NAME'] . PHP_EOL;
}
```

## Смотрите также

- [Result::fetch](fetch.md)
- [Result::setConverters](set-converters.md)
