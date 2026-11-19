---
title: Получить все цепочки Query::getChains
description: Метод Query::getChains возвращает все цепочки полей запроса по псевдонимам и определениям.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getChains` возвращает все цепочки полей запроса — из выборки, фильтра, группировки, сортировки и служебные. Запрос строит цепочки вместе с SQL.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. Каждая цепочка лежит под псевдонимом и под определением, если они различаются.

## Примеры

**Пример.** Код строит запрос и выводит ключи цепочек:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID', 'TITLE' => 'NAME'])->where('ACTIVE', 'Y');
$query->getQuery();

echo implode(',', array_keys($query->getChains()));
```

Код выведет `LID,NAME,TITLE,ACTIVE`. Поле `NAME` лежит под определением `NAME` и под псевдонимом `TITLE`.

## Смотрите также

- [Query::getSelectChains](get-select-chains.md)
- [Query::dump](dump.md)
