---
title: Обработать ошибку подключения PgsqlConnection::connectionErrorHandler
description: Метод PgsqlConnection::connectionErrorHandler превращает ошибку PHP при подключении к PostgreSQL в исключение ConnectionException.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PgsqlConnection::connectionErrorHandler` — обработчик ошибок PHP, который соединение устанавливает на время подключения к серверу. Метод превращает ошибку функции `pg_connect` или `pg_pconnect` в исключение `ConnectionException`. После подключения соединение восстанавливает прежний обработчик.

Метод публичный, потому что PHP вызывает его через `set_error_handler`. Код приложения его не вызывает.

Сигнатура метода в классе `Bitrix\Main\DB\PgsqlConnection`:

```php
public function connectionErrorHandler($errno, $errstr, $errfile = '', $errline = 0, $errcontext = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| errno\* | `int` | Задает уровень ошибки PHP. Метод не использует значение |
| errstr\* | `string` | Задает текст ошибки. Метод передает его в исключение как сообщение базы данных |
| errfile | `string` | Задает файл, в котором возникла ошибка. Метод не использует значение. По умолчанию — `''` |
| errline | `int` | Задает строку файла. Метод не использует значение. По умолчанию — `0` |
| errcontext | `mixed` | Задает контекст ошибки. Метод не использует значение. По умолчанию — `null` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод не возвращает значение и всегда выбрасывает исключение.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | При каждом вызове. Сообщение исключения начинается с `Pgsql connect error`, текст ошибки PHP доступен через `getDatabaseMessage` |

## Примеры

**Пример.** Код перехватывает ошибку подключения к PostgreSQL и выводит текст ошибки. Исключение выбрасывает `connectionErrorHandler` или соединение, если подключиться не удалось:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\ConnectionException;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    Application::getConnection()->queryScalar('SELECT 1');
    echo 'Connected';
}
catch (ConnectionException $exception)
{
    echo $exception->getDatabaseMessage();
}
```

## Смотрите также

- [PgsqlConnection](index.md)
