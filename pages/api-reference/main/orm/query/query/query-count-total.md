---
title: Посчитать записи Query::queryCountTotal
description: Метод Query::queryCountTotal выполняет отдельный запрос COUNT и возвращает общее число записей без лимита и сортировки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::queryCountTotal` выполняет отдельный запрос `COUNT` и возвращает общее число записей. Метод берет условия, соединения и группировку запроса, но не берет лимит и сортировку. Метод [exec](exec.md) вызывает его сам, если запрос включил [countTotal](count-total.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function queryCountTotal()
```

## Возвращаемое значение

Метод возвращает число записей строкой, как его вернула база данных.

## Примеры

**Пример.** Код считает активные языки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::query()->setSelect(['LID'])->where('ACTIVE', 'Y')->setLimit(1)->queryCountTotal();
```

Код выведет число активных языков, например `2`.

## Смотрите также

- [Query::countTotal](count-total.md)
