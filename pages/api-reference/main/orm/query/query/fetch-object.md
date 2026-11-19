---
title: Получить первый объект Query::fetchObject
description: Метод Query::fetchObject выполняет запрос и возвращает первую запись объектом ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::fetchObject` выполняет запрос и возвращает первую запись [объектом](../../../../../orm/objects.md) сущности. Метод — короткая запись `exec()->fetchObject()`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function fetchObject()
```

## Возвращаемое значение

Метод возвращает объект класса сущности, например `EO_Language`, или `null`, если записей нет.

## Особенности

Если выборка пустая, метод выбирает все скалярные поля — добавляет `*`.

## Примеры

**Пример.** Код получает объект языка:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$language = LanguageTable::query()->where('LID', 'ru')->fetchObject();

echo get_class($language) . ' ' . $language->getLid();
```

Код выведет `Bitrix\Main\Localization\EO_Language ru`.

## Смотрите также

- [Query::fetchCollection](fetch-collection.md)
- [Объекты](../../../../../orm/objects.md)
