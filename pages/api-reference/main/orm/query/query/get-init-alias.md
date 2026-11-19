---
title: Получить псевдоним основной таблицы Query::getInitAlias
description: Метод Query::getInitAlias возвращает псевдоним основной таблицы запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getInitAlias` возвращает псевдоним основной таблицы запроса. Псевдоним нужен, чтобы писать условия на SQL в выражениях и подзапросах.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getInitAlias($withPostfix = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| withPostfix | `bool` | Значение `true` добавляет суффикс из [setTableAliasPostfix](set-table-alias-postfix.md). По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает псевдоним.

- Если задан [setCustomBaseTableAlias](set-custom-base-table-alias.md), метод возвращает его.
- Иначе — код сущности строчными буквами с суффиксом.
- Если псевдоним длиннее, чем допускает база данных, метод возвращает `base` с суффиксом.

## Примеры

**Пример.** Код получает псевдоним с суффиксом и без него:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setTableAliasPostfix('_x');

echo $query->getInitAlias() . ' ' . $query->getInitAlias(false);
```

Код выведет `main_localization_language_x main_localization_language`.

## Смотрите также

- [Query::setCustomBaseTableAlias](set-custom-base-table-alias.md)
- [Entity::getCode](../../entity/get-code.md)
