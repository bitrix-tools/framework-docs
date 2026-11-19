---
title: Получить правую кавычку идентификатора SqlHelper::getRightQuote
description: Метод SqlHelper::getRightQuote возвращает символ, которым база данных закрывает имя таблицы или колонки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `SqlHelper::getRightQuote` возвращает символ, которым база данных закрывает имя таблицы или колонки. Метод [quote](quote.md) использует его, чтобы взять имя в кавычки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getRightQuote()
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `SqlHelper` | Пустая строка |
| `MysqliSqlHelper` | `` ` `` |
| `PgsqlSqlHelper` | `"` |

## Примеры

**Пример.** Код проверяет, что левая и правая кавычки совпадают:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

var_dump($helper->getLeftQuote() === $helper->getRightQuote());
```

## Смотрите также

- [SqlHelper::getLeftQuote](get-left-quote.md)
- [SqlHelper::quote](quote.md)
