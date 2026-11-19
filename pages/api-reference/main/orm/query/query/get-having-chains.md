---
title: Получить цепочки HAVING Query::getHavingChains
description: Метод Query::getHavingChains возвращает цепочки полей условий HAVING — с агрегатными функциями.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getHavingChains` возвращает цепочки полей условий `HAVING`. В них попадают условия по выражениям с агрегатными функциями, например `COUNT`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getHavingChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. До построения SQL массив пустой.

## Примеры

**Пример.** Код фильтрует по числу языков в группе и выводит цепочки `HAVING`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()
    ->setSelect(['ACTIVE', Query::expr('CNT')->count('LID')])
    ->having('CNT', '>', 0);
$query->getQuery();

echo implode(',', array_keys($query->getHavingChains()));
```

Код выведет `CNT`.

## Смотрите также

- [Query::getWhereChains](get-where-chains.md)
