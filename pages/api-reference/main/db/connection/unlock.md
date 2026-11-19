---
title: Снять именованную блокировку Connection::unlock
description: Метод Connection::unlock снимает глобальную именованную блокировку, установленную методом lock.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::unlock` снимает именованную блокировку, которую установил [lock](lock.md).

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function unlock($name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя блокировки — то же значение, что передано в `lock` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если блокировка снята, иначе `false`.

| Реализация | Как снимает блокировку |
| --- | --- |
| `Connection` | Базовая реализация ничего не делает и возвращает `true` |
| `MysqliConnection` | Выполняет `RELEASE_LOCK` на основном сервере. Возвращает `true`, только если функция вернула `1` |
| `PgsqlConnection` | Вызывает функцию базы данных `bx_release_lock`. Возвращает `true`, если функция вернула `0` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код устанавливает блокировку, снимает ее и выводит, удалось ли снять блокировку:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

if ($connection->lock('demo_api_queue'))
{
    var_dump($connection->unlock('demo_api_queue'));
}
```

## Смотрите также

- [Connection::lock](lock.md)
