---
title: Проверить обратные связи Query::hasBackReference
description: Метод Query::hasBackReference проверяет, есть ли в запросе поля через обратные связи 1:N, из-за которых строки могут повторяться.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::hasBackReference` проверяет, есть ли в запросе поля через обратные связи — связи 1:N, например `GROUPS` у пользователя. Из-за таких связей запись основной таблицы может повториться в результате.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function hasBackReference()
```

## Возвращаемое значение

Метод возвращает `true`, если обратная связь есть, иначе `false`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | Запрос еще не построен. Текст — `Query has not been executed or built` |

## Примеры

**Пример.** Код проверяет запрос с полем через группы пользователя:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = UserTable::query()->setSelect(['ID', 'GROUP_ID' => 'GROUPS.GROUP_ID']);
$query->getQuery();

var_dump($query->hasBackReference());
```

Код выведет `bool(true)`.

## Смотрите также

- [Query::disableDataDoubling](disable-data-doubling.md)
