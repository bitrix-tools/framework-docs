---
title: Включить подсчет записей Query::countTotal
description: Метод Query::countTotal включает подсчет общего числа записей без учета лимита или возвращает текущий признак.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::countTotal` включает подсчет общего числа записей без учета лимита. Это число возвращает метод `getCount()` результата. Подсчет нужен для постраничной навигации. Без аргумента метод возвращает текущий признак.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function countTotal($count = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| count | `bool` или `null` | Значение `true` включает подсчет, `false` выключает. По умолчанию — `null`, метод возвращает признак |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

С аргументом метод возвращает тот же объект `Query`. Без аргумента — `true`, `false` или `null`, если признак не задавали.

## Особенности

Запрос считает записи отдельным запросом [queryCountTotal](query-count-total.md), только если выборка заполнила лимит целиком. Без лимита или на последней странице запрос считает строки результата.

## Примеры

**Пример.** Код выбирает одну запись и получает общее число:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::query()->setSelect(['LID'])->setLimit(1)->countTotal(true)->exec();

echo count($result->fetchAll()) . ' ' . $result->getCount();
```

Код выведет `1 2`, если на сайте два языка.

## Смотрите также

- [Query::queryCountTotal](query-count-total.md)
- [Query::setLimit](set-limit.md)
