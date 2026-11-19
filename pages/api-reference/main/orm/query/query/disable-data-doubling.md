---
title: Запретить дублирование строк Query::disableDataDoubling
description: Метод Query::disableDataDoubling заменяет условия по связям 1:N подзапросом ID IN (SELECT ...), чтобы записи не повторялись.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::disableDataDoubling` заменяет условия по связям 1:N подзапросом `ID IN (SELECT ...)`. Так запись основной таблицы не повторится в результате, даже если подходят несколько связанных записей. Например, пользователь из двух нужных групп вернется один раз.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function disableDataDoubling()
```

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

- Метод работает только для сущностей с первичным ключом из одного поля. Для составного ключа метод выдает предупреждение PHP `E_USER_WARNING` и ничего не меняет.
- Метод меняет только условия фильтра. Поля связанной таблицы в выборке по-прежнему соединяют таблицы.

## Примеры

**Пример.** Код строит SQL условия по группам пользователя с подзапросом:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$sql = UserTable::query()->setSelect(['ID'])->where('GROUPS.GROUP_ID', 1)->disableDataDoubling()->getQuery();

echo str_contains($sql, '`main_user`.`ID` IN (SELECT') ? 'subquery' : 'join';
```

Код выведет `subquery`.

## Смотрите также

- [Query::enableDataDoubling](enable-data-doubling.md)
- [Связи между сущностями](../../../../../orm/entity-relations.md)
