---
title: Получить все строки результата Result::fetchAll
description: Метод Result::fetchAll возвращает все оставшиеся строки результата массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Result::fetchAll` вызывает [fetch](fetch.md), пока строки не закончатся, и возвращает их массивом. Метод читает строки с текущей позиции. Строки, которые код уже прочитал через `fetch`, в массив не попадают.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function fetchAll(?\Bitrix\Main\Text\Converter $converter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| converter | `Bitrix\Main\Text\Converter`, `null` | Задает объект, который кодирует каждое значение строки. Метод передает его в `fetch`. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает массив строк, каждая строка — массив `имя колонки => значение`. Значения преобразованы так же, как в [fetch](fetch.md). Если строк нет, метод возвращает пустой массив.

Метод держит в памяти все строки сразу. Для большого результата читайте строки по одной через `fetch` или `foreach`.

## Примеры

**Пример.** Код получает логины трех пользователей одним массивом:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows =
    Application::getConnection()
        ->query('SELECT ID, LOGIN FROM ' . UserTable::getTableName() . ' ORDER BY ID', 3)
        ->fetchAll()
;

echo implode(', ', array_column($rows, 'LOGIN'));
```

## Смотрите также

- [Result::fetch](fetch.md)
- [Result::getIterator](get-iterator.md)
