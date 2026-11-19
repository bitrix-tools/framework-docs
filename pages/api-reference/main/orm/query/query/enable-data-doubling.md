---
title: Разрешить дублирование строк Query::enableDataDoubling
description: Метод Query::enableDataDoubling снова соединяет таблицы через JOIN для условий по связям 1:N после disableDataDoubling.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::enableDataDoubling` отменяет [disableDataDoubling](disable-data-doubling.md). Условия по связям 1:N снова соединяют таблицы через `JOIN`. Запись основной таблицы может повториться в результате столько раз, сколько у нее связанных записей. Это поведение по умолчанию.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function enableDataDoubling()
```

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Примеры

**Пример.** Код строит SQL условия по группам пользователя с соединением таблиц:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$sql = UserTable::query()->setSelect(['ID'])->where('GROUPS.GROUP_ID', 1)->enableDataDoubling()->getQuery();

echo str_contains($sql, 'INNER JOIN `b_user_group`') ? 'join' : 'subquery';
```

Код выведет `join`.

## Смотрите также

- [Query::disableDataDoubling](disable-data-doubling.md)
