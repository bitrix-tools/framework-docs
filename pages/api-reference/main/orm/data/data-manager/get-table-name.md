---
title: Задать имя таблицы DataManager::getTableName
description: Метод DataManager::getTableName возвращает имя таблицы базы данных. Наследник переопределяет его, чтобы связать класс с таблицей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

Метод `DataManager::getTableName` возвращает имя таблицы в базе данных. Наследник переопределяет метод и возвращает имя своей таблицы. ORM подставляет его в SQL-запросы.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getTableName()
```

## Возвращаемое значение

Метод возвращает строку с именем таблицы. Базовый класс возвращает `null`.

## Особенности

Если наследник не переопределил метод, ORM строит имя таблицы из имени класса. Задавайте имя сами, чтобы оно не зависело от пространства имен класса.

## Примеры

**Пример.** Код выводит имена таблиц стандартных классов:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo UserTable::getTableName() . ' ' . LanguageTable::getTableName();
```

Код выведет `b_user b_language`.

## Смотрите также

- [DataManager::getMap](get-map.md)
- [DataManager::getConnectionName](get-connection-name.md)
