---
title: Получить число строк в выборке Result::getSelectedRowsCount
description: Метод ORM\Query\Result::getSelectedRowsCount возвращает число строк, которое вернул запрос с учетом limit.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getSelectedRowsCount` возвращает число строк, которое вернул запрос. Метод учитывает `limit`. Метод [getCount](get-count.md) возвращает общее число строк без `limit`. Метод вызывает [DB\Result::getSelectedRowsCount](../../../db/result/get-selected-rows-count.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getSelectedRowsCount()
```

## Возвращаемое значение

Метод возвращает целое число.

## Примеры

**Пример.** Код сравнивает число строк выборки и общее число строк:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => ['@LID' => ['en', 'ru']],
    'limit' => 1,
    'count_total' => true,
]);

echo $result->getSelectedRowsCount() . ' ' . $result->getCount();
```

Код выведет `1 2`.

## Смотрите также

- [Result::getCount](get-count.md)
