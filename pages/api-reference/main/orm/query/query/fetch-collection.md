---
title: Получить коллекцию Query::fetchCollection
description: Метод Query::fetchCollection выполняет запрос и возвращает все записи коллекцией объектов ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::fetchCollection` выполняет запрос и возвращает все записи [коллекцией](../../../../../orm/collections.md) объектов. Метод — короткая запись `exec()->fetchCollection()`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function fetchCollection()
```

## Возвращаемое значение

Метод возвращает коллекцию класса сущности, например `EO_Language_Collection`. Если записей нет, коллекция пустая.

## Особенности

Если выборка пустая, метод выбирает все скалярные поля — добавляет `*`.

## Примеры

**Пример.** Код получает коллекцию языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$languages = LanguageTable::query()->setOrder('LID')->fetchCollection();

echo get_class($languages) . ' ' . implode(',', $languages->getLidList());
```

Код выведет `Bitrix\Main\Localization\EO_Language_Collection en,ru`. Список языков зависит от сайта.

## Смотрите также

- [Query::fetchObject](fetch-object.md)
- [Коллекции](../../../../../orm/collections.md)
