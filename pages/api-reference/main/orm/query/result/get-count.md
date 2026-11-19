---
title: Получить общее число строк Result::getCount
description: Метод ORM\Query\Result::getCount возвращает общее число строк по фильтру без учета limit, если запрос выполнен с count_total.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getCount` возвращает общее число строк по фильтру без учета `limit` и `offset`. Число нужно для постраничной навигации. Метод вызывает [DB\Result::getCount](../../../db/result/get-count.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getCount()
```

## Возвращаемое значение

Метод возвращает целое число.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ObjectPropertyException` | Запрос не содержит `count_total`, и метод [setCount](set-count.md) не задал число |

## Особенности

Параметр `count_total` может выполнить дополнительный запрос `COUNT`, если выборка ограничена `limit` и вернула полную страницу. Включайте параметр, только когда число нужно.

## Примеры

**Пример.** Код получает страницу и общее число строк для навигации:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-languages');
$nav->setPageSize(1);

$result = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => ['@LID' => ['en', 'ru']],
    'offset' => $nav->getOffset(),
    'limit' => $nav->getLimit(),
    'count_total' => true,
]);
$nav->setRecordCount($result->getCount());

echo $nav->getPageCount();
```

Код выведет `2`.

## Смотрите также

- [Result::setCount](set-count.md)
- [PageNavigation](../../../ui/page-navigation/index.md)
