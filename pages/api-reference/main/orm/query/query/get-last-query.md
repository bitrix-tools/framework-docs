---
title: Получить последний выполненный запрос Query::getLastQuery
description: Статический метод Query::getLastQuery возвращает текст последнего SQL-запроса, который выполнил любой запрос ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Query::getLastQuery` возвращает текст последнего SQL-запроса, который выполнил любой запрос ORM в этом хите. Метод нужен для отладки `getList` и других методов, которые строят запрос сами.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public static function getLastQuery()
```

## Возвращаемое значение

Метод возвращает строку SQL или `null`, если запросы ORM еще не выполнялись.

## Особенности

Метод не учитывает запросы с результатом из кеша выборок и отдельный запрос подсчета записей.

## Примеры

**Пример.** Код выполняет `getList` и получает его SQL:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

LanguageTable::getList(['select' => ['LID'], 'limit' => 1]);

echo str_contains(Query::getLastQuery(), 'FROM `b_language`') ? 'b_language' : 'other';
```

Код выведет `b_language`.

## Смотрите также

- [Query::getQuery](get-query.md)
