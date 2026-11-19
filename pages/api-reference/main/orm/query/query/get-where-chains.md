---
title: Получить цепочки WHERE Query::getWhereChains
description: Метод Query::getWhereChains возвращает цепочки полей условий WHERE — без агрегатных функций.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getWhereChains` возвращает цепочки полей условий `WHERE`. В них попадают условия фильтра без агрегатных функций.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getWhereChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. До построения SQL массив пустой.

## Примеры

**Пример.** Код строит запрос и выводит цепочки `WHERE`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID'])->where('ACTIVE', 'Y');
$query->getQuery();

echo implode(',', array_keys($query->getWhereChains()));
```

Код выведет `ACTIVE`.

## Смотрите также

- [Query::getFilterChains](get-filter-chains.md)
- [Query::getHavingChains](get-having-chains.md)
