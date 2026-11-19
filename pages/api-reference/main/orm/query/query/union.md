---
title: Объединить запросы Query::union
description: Метод Query::union добавляет запросы в UNION — результат без повторяющихся строк.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::union` объединяет текущий запрос с другими через `UNION`. Результат содержит строки всех запросов без повторов. Запросы должны выбирать одинаковое число полей.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function union()
```

## Параметры

Метод принимает один или несколько запросов — объекты `Query` или `Bitrix\Main\DB\SqlExpression`.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Аргумент не `Query` и не `SqlExpression` |

## Особенности

- Сортировку и лимит всего объединения задают [setUnionOrder](set-union-order.md) и [setUnionLimit](set-union-limit.md). Если у первого запроса есть сортировка или лимит, запрос заключает его в скобки, поэтому методы [setOrder](set-order.md) и [setLimit](set-limit.md) действуют только на него.
- С объединением запрос не добавляет в выборку первичный ключ.

## Примеры

**Пример.** Код объединяет два запроса:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->where('LID', 'ru')
    ->union(LanguageTable::query()->setSelect(['LID'])->where('LID', 'en'))
    ->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru,en`.

## Смотрите также

- [Query::unionAll](union-all.md)
- [Query::setUnionOrder](set-union-order.md)
