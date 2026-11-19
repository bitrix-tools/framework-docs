---
title: Проверить агрегацию Query::hasAggregation
description: Метод Query::hasAggregation проверяет, есть ли в запросе группировка, HAVING или агрегатные функции.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::hasAggregation` проверяет, есть ли в запросе агрегация — группировка, условия `HAVING` или агрегатные функции в выборке и сортировке. С агрегацией запрос не добавляет в выборку первичный ключ.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function hasAggregation()
```

## Возвращаемое значение

Метод возвращает `true`, если агрегация есть, иначе `false`.

## Особенности

Метод проверяет цепочки, а запрос строит их вместе с SQL. До [exec](exec.md) или [getQuery](get-query.md) метод вернет `false`.

## Примеры

**Пример.** Код проверяет запрос с выражением `COUNT` после построения SQL:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['ACTIVE', Query::expr('CNT')->count('LID')]);
$before = $query->hasAggregation();
$query->getQuery();

var_dump($before, $query->hasAggregation());
```

Код выведет:

```text
bool(false)
bool(true)
```

## Смотрите также

- [Query::setGroup](set-group.md)
