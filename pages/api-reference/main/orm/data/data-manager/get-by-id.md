---
title: Выбрать запись по ключу без параметров DataManager::getById
description: Метод DataManager::getById выбирает запись по первичному ключу со всеми полями и возвращает результат ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getById` выбирает запись по первичному ключу со всеми полями таблицы. Метод вызывает [getByPrimary](get-by-primary.md) без дополнительных параметров.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getById($id)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `mixed` | Задает первичный ключ, как в `getByPrimary` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект [Result](../../query/result/index.md), а не запись. Чтобы сразу получить запись, используйте [getRowById](get-row-by-id.md).

## Примеры

**Пример.** Код выбирает язык по ключу:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::getById('ru')->fetch();

echo $row['NAME'];
```

Код выведет `Russian`.

## Смотрите также

- [DataManager::getByPrimary](get-by-primary.md)
- [DataManager::getRowById](get-row-by-id.md)
