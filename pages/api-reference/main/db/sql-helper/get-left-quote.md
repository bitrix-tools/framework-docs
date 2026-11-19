---
title: Получить левую кавычку идентификатора SqlHelper::getLeftQuote
description: Метод SqlHelper::getLeftQuote возвращает символ, которым база данных открывает имя таблицы или колонки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `SqlHelper::getLeftQuote` возвращает символ, которым база данных открывает имя таблицы или колонки. Метод [quote](quote.md) использует его, чтобы взять имя в кавычки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getLeftQuote()
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `SqlHelper` | Пустая строка |
| `MysqliSqlHelper` | `` ` `` |
| `PgsqlSqlHelper` | `"` |

## Примеры

**Пример.** Код выводит кавычки идентификатора для базы данных соединения по умолчанию:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

echo $helper->getLeftQuote() . 'CODE' . $helper->getRightQuote();
```

Для MySQL код выведет `` `CODE` ``.

## Смотрите также

- [SqlHelper::getRightQuote](get-right-quote.md)
- [SqlHelper::quote](quote.md)
