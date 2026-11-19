---
title: Задать общее число строк Result::setCount
description: Метод Result::setCount задает общее число строк, которое затем возвращает getCount.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.10

{% endnote %}

Метод `Result::setCount` задает общее число строк для результата. Метод не считает строки сам, он только сохраняет значение для [getCount](get-count.md). ORM вызывает метод, если код передал в `getList` параметр `count_total`.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function setCount($n)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| n\* | `int` | Задает общее число строк. Метод приводит значение к целому числу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код выбирает первую страницу пользователей и отдельным запросом считает общее число строк:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$table = UserTable::getTableName();

$result = $connection->query('SELECT ID, LOGIN FROM ' . $table . ' ORDER BY ID', 0, 2);
$result->setCount($connection->queryScalar('SELECT COUNT(*) FROM ' . $table));

echo $result->getSelectedRowsCount() . ' of ' . $result->getCount();
```

## Смотрите также

- [Result::getCount](get-count.md)
