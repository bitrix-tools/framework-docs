---
title: Создать построитель запроса DataManager::query
description: Метод DataManager::query возвращает объект Query для таблицы, чтобы собрать запрос цепочкой методов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::query` создает построитель запроса `Bitrix\Main\ORM\Query\Query` для таблицы. Методы `setSelect`, `where`, `setOrder` и `setLimit` задают запрос цепочкой. Методы `exec`, `fetch`, `fetchObject` и `fetchCollection` выполняют его. Построитель нужен, когда условия зависят от логики кода, например код добавляет их в цикле.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function query()
```

## Возвращаемое значение

Метод возвращает новый объект класса из [getQueryClass](get-query-class.md), по умолчанию `Bitrix\Main\ORM\Query\Query`.

## Особенности

Запрос работает с копией сущности. Поля, которые добавляет `registerRuntimeField`, не попадают в сущность таблицы.

## Примеры

**Пример.** Код собирает запрос цепочкой методов:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$languages = LanguageTable::query()
    ->setSelect(['LID', 'NAME'])
    ->whereIn('LID', ['en', 'ru'])
    ->setOrder(['LID' => 'ASC'])
    ->fetchCollection();

echo implode(',', $languages->getNameList());
```

Код выведет `English,Russian`.

## Смотрите также

- [DataManager::getList](get-list.md)
- [Построитель запросов](../../../../../orm/query-builder.md)
