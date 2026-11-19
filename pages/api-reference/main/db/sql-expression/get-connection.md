---
title: Получить соединение SqlExpression::getConnection
description: Метод SqlExpression::getConnection возвращает соединение, по правилам которого метод compile экранирует значения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlExpression::getConnection` возвращает соединение, по правилам которого метод [compile](compile.md) экранирует значения.

Сигнатура метода в классе `Bitrix\Main\DB\SqlExpression`:

```php
public function getConnection()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\DB\Connection`.

Если соединение задано через [setConnection](set-connection.md), метод возвращает его. Иначе метод получает соединение по умолчанию через `Application::getConnection()` и запоминает его в объекте. Следующие вызовы возвращают запомненное соединение.

Если соединение по умолчанию не настроено в `.settings.php`, метод возвращает `null`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\Config\ConfigurationException` | Метод получает соединение по умолчанию, а класс соединения из `.settings.php` не найден |

## Примеры

**Пример.** Код выводит тип базы данных, по правилам которой выражение экранирует значения:

```php
<?php
use Bitrix\Main\DB\SqlExpression;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$expression = new SqlExpression('?# = ?i', 'ID', 1);

echo $expression->getConnection()->getType();
```

## Смотрите также

- [SqlExpression::setConnection](set-connection.md)
- [SqlExpression::compile](compile.md)
