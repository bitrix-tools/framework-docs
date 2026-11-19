---
title: Получить строки коллекцией Result::fetchCollection
description: Метод ORM\Query\Result::fetchCollection читает все оставшиеся строки выборки и возвращает коллекцию объектов ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::fetchCollection` читает все оставшиеся строки выборки и возвращает коллекцию объектов ORM, например `EO_User_Collection`. Коллекция нужна, чтобы обработать объекты пачкой. Например, получить списки значений методами `get*List`, изменить объекты и сохранить их одним вызовом `save`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
final public function fetchCollection()
```

## Возвращаемое значение

Метод возвращает коллекцию класса сущности. Если строк нет, коллекция пустая.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | Запрос группирует строки, например содержит `group` или агрегат вместе с обычными полями |
| `Bitrix\Main\SystemException` | В выборке нет первичного ключа, например `select` содержит только агрегаты |

## Особенности

Метод вызывает [fetchObject](fetch-object.md) для каждой строки, поэтому для него действуют те же правила. Это первичный ключ в выборке, общий реестр объектов и приведение типов.

## Примеры

**Пример.** Код читает языки коллекцией и получает список кодов:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$languages = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => ['@LID' => ['en', 'ru']],
    'order' => ['LID' => 'ASC'],
])->fetchCollection();

echo get_class($languages) . ' ' . implode(',', $languages->getLidList());
```

Код выведет `Bitrix\Main\Localization\EO_Language_Collection en,ru`.

## Смотрите также

- [Result::fetchObject](fetch-object.md)
- [Коллекции](../../../../../orm/collections.md)
