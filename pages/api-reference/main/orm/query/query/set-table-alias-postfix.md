---
title: Задать суффикс псевдонимов таблиц Query::setTableAliasPostfix
description: Метод Query::setTableAliasPostfix задает суффикс псевдонимов таблиц, чтобы подзапрос не конфликтовал с внешним запросом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setTableAliasPostfix` задает суффикс псевдонимов таблиц запроса. Суффикс нужен, когда запрос становится подзапросом той же таблицы. Без суффикса псевдонимы совпадут. Запрос сам задает суффикс для подзапросов [disableDataDoubling](disable-data-doubling.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setTableAliasPostfix($postfix)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| postfix\* | `string` | Задает суффикс, например `_sub` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Примеры

**Пример.** Код задает суффикс и получает псевдоним основной таблицы:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::query()->setTableAliasPostfix('_sub')->getInitAlias();
```

Код выведет `main_localization_language_sub`.

## Смотрите также

- [Query::getTableAliasPostfix](get-table-alias-postfix.md)
- [Query::getInitAlias](get-init-alias.md)
