---
title: Получить список соединений Query::getJoinMap
description: Метод Query::getJoinMap возвращает соединения таблиц, которые запрос добавил для полей связанных сущностей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getJoinMap` возвращает соединения таблиц, которые запрос добавил для полей связанных сущностей. По списку видно, какие `JOIN` попадут в SQL.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getJoinMap()
```

## Возвращаемое значение

Метод возвращает массив соединений. Каждый элемент содержит ключи `type` — тип соединения, `entity` — сущность, `definition` — путь связи, `table` — таблица, `alias` — псевдоним таблицы, `reference` — условия, `map_key` — служебный ключ. До построения SQL массив пустой.

## Примеры

**Пример.** Код выбирает поле связанной сущности и выводит соединение:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = UserTable::query()->setSelect(['ID', 'LANG_NAME' => 'ACTIVE_LANGUAGE.NAME']);
$query->getQuery();

foreach ($query->getJoinMap() as $join)
{
    echo $join['type'] . ' ' . $join['table'] . ' ' . $join['definition'];
}
```

Код выведет `LEFT b_language ACTIVE_LANGUAGE`.

## Смотрите также

- [Join](../join/index.md)
- [Query::hasBackReference](has-back-reference.md)
