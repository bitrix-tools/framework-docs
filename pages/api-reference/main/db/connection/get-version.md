---
title: Получить версию сервера Connection::getVersion
description: Метод Connection::getVersion возвращает версию сервера базы данных массивом из двух элементов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getVersion` возвращает версию сервера базы данных. Метод подключается к базе данных, если подключения еще нет. Аналог в классическом API — `CDatabase::GetVersion`, он возвращает только строку версии.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function getVersion();
```

## Возвращаемое значение

Метод возвращает массив `array` из двух элементов.

#|
|| Ключ | Описание ||
|| 0<br>`string` | Содержит номер версии сервера ||
|| 1<br>`null` | В реализациях MySQL и PostgreSQL всегда `null` ||
|#

Формат номера зависит от реализации.

| Реализация | Формат номера |
| --- | --- |
| `MysqliConnection` | Три числа через точку, например `8.0.36`. Метод извлекает их из строки версии сервера |
| `PgsqlConnection` | Два числа через точку, например `16.4` |

Метод запоминает версию в объекте соединения. Повторный вызов не обращается к серверу.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код проверяет, что версия MySQL не ниже 8.0:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
[$version] = $connection->getVersion();

if ($connection->getType() === 'mysql' && version_compare($version, '8.0.0', '<'))
{
    echo 'MySQL 8.0 or later is required';
}
else
{
    echo 'Version ' . $version;
}
```

## Смотрите также

- [Connection::getType](get-type.md)
