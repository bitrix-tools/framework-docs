---
title: Задать подключение к базе данных DataManager::getConnectionName
description: Метод DataManager::getConnectionName возвращает имя подключения из секции connections файла .settings.php, через которое ORM работает с таблицей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.9

{% endnote %}

Метод `DataManager::getConnectionName` возвращает имя подключения к базе данных. Наследник переопределяет метод, если таблица находится в другой базе данных. Подключение с этим именем описывают в секции `connections` файла `.settings.php`.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getConnectionName()
```

## Возвращаемое значение

Метод возвращает строку. Базовый класс возвращает `'default'` — основное подключение сайта.

## Примеры

**Пример.** Код выводит имя подключения и класс подключения таблицы:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo UserTable::getConnectionName() . ' ' . get_class(UserTable::getEntity()->getConnection());
```

На сайте с MySQL код выведет `default Bitrix\Main\DB\MysqliConnection`.

## Смотрите также

- [Connection](../../../db/connection/index.md)
