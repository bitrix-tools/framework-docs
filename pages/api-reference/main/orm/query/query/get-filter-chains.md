---
title: Получить цепочки фильтра Query::getFilterChains
description: Метод Query::getFilterChains возвращает цепочки всех полей фильтра — и WHERE, и HAVING.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getFilterChains` возвращает цепочки всех полей фильтра. Запрос затем делит их на две части. Цепочки `WHERE` возвращает [getWhereChains](get-where-chains.md), цепочки `HAVING` — [getHavingChains](get-having-chains.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getFilterChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. До построения SQL массив пустой.

## Примеры

**Пример.** Код строит запрос с двумя условиями и выводит цепочки фильтра:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID'])->where('ACTIVE', 'Y')->where('SORT', '>', 0);
$query->getQuery();

echo implode(',', array_keys($query->getFilterChains()));
```

Код выведет `ACTIVE,SORT`.

## Смотрите также

- [Query::getWhereChains](get-where-chains.md)
- [Query::getHavingChains](get-having-chains.md)
