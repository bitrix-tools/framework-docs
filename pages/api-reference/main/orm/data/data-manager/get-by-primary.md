---
title: Выбрать запись по первичному ключу DataManager::getByPrimary
description: Метод DataManager::getByPrimary выбирает запись по первичному ключу с дополнительными параметрами getList и возвращает результат ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getByPrimary` выбирает запись по первичному ключу. Метод добавляет условие по ключу к параметрам и вызывает [getList](get-list.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getByPrimary($primary, array $parameters = array())
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| primary\* | `mixed` | Задает первичный ключ. Для ключа из одного поля — значение, например `1` или `'en'`. Для составного ключа — массив `имя поля => значение` |
| parameters | `array` | Задает параметры `getList`, например `select`. Условие `filter` метод объединяет с условием по ключу через `AND`. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект [Result](../../query/result/index.md), а не запись. Метод `fetch` результата возвращает запись массивом, `fetchObject` — объектом ORM.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Ключ пустой, содержит неизвестное поле или значение не скаляр и не дата. Ключ составной, а код передал одно значение |

## Примеры

**Пример.** Код выбирает язык по ключу и читает объект:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$language = LanguageTable::getByPrimary('en', ['select' => ['LID', 'NAME']])->fetchObject();

echo $language->getName();
```

Код выведет `English`.

## Смотрите также

- [DataManager::getRowById](get-row-by-id.md)
- [DataManager::getById](get-by-id.md)
