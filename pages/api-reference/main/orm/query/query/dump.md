---
title: Вывести отладочные сведения Query::dump
description: Метод Query::dump выводит в HTML последний SQL-запрос, цепочки полей и соединения таблиц запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::dump` выводит отладочные сведения о запросе в теге `<pre>` — цепочки полей по разделам и список соединений таблиц. Первым метод выводит последний SQL, который выполнил любой запрос ORM в хите, как [getLastQuery](get-last-query.md). Это не обязательно SQL этого запроса. Метод нужен при разработке. Не оставляйте вызов в рабочем коде.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function dump()
```

## Возвращаемое значение

Метод ничего не возвращает и выводит сведения через `echo`.

## Особенности

Цепочки появляются после построения SQL. Вызывайте метод после [exec](exec.md) или [getQuery](get-query.md).

## Примеры

**Пример.** Код выполняет запрос и выводит число цепочек выборки из отладочных сведений:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID', 'NAME'])->setLimit(1);
$query->exec();

ob_start();
$query->dump();
preg_match('/size of select_chains: \d+/', ob_get_clean(), $match);

echo $match[0];
```

Код выведет `size of select_chains: 2`.

## Смотрите также

- [Query::getQuery](get-query.md)
- [Query::getChains](get-chains.md)
