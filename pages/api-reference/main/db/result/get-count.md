---
title: Получить общее число строк Result::getCount
description: Метод Result::getCount возвращает общее число строк, заданное через setCount, например для постраничной навигации ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.10

{% endnote %}

Метод `Result::getCount` возвращает общее число строк, которое задал [setCount](set-count.md). В отличие от [getSelectedRowsCount](get-selected-rows-count.md), это число не зависит от ограничения по числу строк в запросе.

Для результата ORM значение задает `getList`, если код передал в него параметр `count_total` со значением `true`.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function getCount()
```

## Возвращаемое значение

Метод возвращает целое число `int`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ObjectPropertyException` | Код не задал значение через `setCount`, например вызвал `getList` без `count_total` |

## Примеры

**Пример.** Код выбирает две строки через ORM и выводит общее число пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = UserTable::getList([
    'select' => ['ID', 'LOGIN'],
    'order' => ['ID' => 'ASC'],
    'limit' => 2,
    'count_total' => true,
]);

echo $result->getSelectedRowsCount() . ' of ' . $result->getCount();
```

## Смотрите также

- [Result::setCount](set-count.md)
- [Result::getSelectedRowsCount](get-selected-rows-count.md)
