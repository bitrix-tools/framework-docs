---
title: Объединить запросы с повторами Query::unionAll
description: Метод Query::unionAll добавляет запросы в UNION ALL — результат сохраняет повторяющиеся строки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::unionAll` объединяет текущий запрос с другими через `UNION ALL`. В отличие от [union](union.md), результат сохраняет повторяющиеся строки, а база данных не тратит время на их поиск.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function unionAll()
```

## Параметры

Метод принимает один или несколько запросов — объекты `Query` или `Bitrix\Main\DB\SqlExpression`.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Аргумент не `Query` и не `SqlExpression` |

## Примеры

**Пример.** Код объединяет запрос с самим собой:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->where('LID', 'ru')
    ->unionAll(LanguageTable::query()->setSelect(['LID'])->where('LID', 'ru'))
    ->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru,ru`.

## Смотрите также

- [Query::union](union.md)
