---
title: Получить запись по первичному ключу DataManager::getRowById
description: Метод DataManager::getRowById возвращает запись по первичному ключу массивом или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `DataManager::getRowById` возвращает запись по первичному ключу массивом. Метод вызывает [getByPrimary](get-by-primary.md) и читает первую запись.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getRowById($id, array $parameters = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `mixed` | Задает первичный ключ, как в `getByPrimary` |
| parameters | `array` | Задает параметры `getList`, например `select`. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив или `null`, если записи с таким ключом нет.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Ключ пустой или содержит неизвестное поле, как в `getByPrimary` |

## Примеры

**Пример.** Код получает язык по ключу и проверяет несуществующий ключ:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::getRowById('en', ['select' => ['NAME']]);

echo $row['NAME'] . ' ' . var_export(LanguageTable::getRowById('zz'), true);
```

Код выведет `English NULL`.

## Смотрите также

- [DataManager::getByPrimary](get-by-primary.md)
- [DataManager::getRow](get-row.md)
