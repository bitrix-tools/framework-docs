---
title: Проверить отложенное подключение Connection::isDeferred
description: Метод Connection::isDeferred проверяет, откладывает ли соединение подключение к базе данных до первого запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::isDeferred` проверяет флаг `Connection::DEFERRED` в ключе `options` настроек соединения. Метод `connect` не открывает отложенное подключение. Отложенное подключение открывается при первом запросе.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function isDeferred()
```

## Возвращаемое значение

Метод возвращает `true`, если в значении `options` установлен бит `2`, иначе `false`.

Если ключа `options` в настройках нет, соединение использует значение `2`. Поэтому по умолчанию подключение отложенное и метод возвращает `true`.

## Примеры

**Пример.** Код выводит режимы подключения соединения по умолчанию:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

var_dump($connection->isDeferred(), $connection->isPersistent());
```

## Смотрите также

- [Connection::isPersistent](is-persistent.md)
- [Константы класса Connection](index.md#константы)
