---
title: Result — результат запроса к базе данных
description: Абстрактный класс Bitrix\Main\DB\Result читает строки результата запроса и преобразует значения при выборке.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Result` описывает результат SQL-запроса. Объект возвращает метод [Connection::query](../connection/query.md), создавать его конструктором не нужно. Наследник `Bitrix\Main\ORM\Query\Result` возвращает `getList` ORM-классов, поэтому методы `Result` работают и для результатов ORM.

Строки читают методами [fetch](fetch.md) и [fetchAll](fetch-all.md) или в цикле `foreach`. При выборке `fetch` превращает значения дат в объекты `Bitrix\Main\Type\Date` и `Bitrix\Main\Type\DateTime`. Метод [fetchRaw](fetch-raw.md) возвращает строку без преобразований.

Аналог в классическом API — класс `CDBResult`.

## Методы класса

Таблицы ниже группируют методы по задачам.

### Чтение строк

| Метод | Описание | С версии |
| --- | --- | --- |
| [fetch](fetch.md) | Возвращает следующую строку с преобразованными значениями | 14.0.0 |
| [fetchAll](fetch-all.md) | Возвращает все оставшиеся строки массивом | 14.0.0 |
| [fetchRaw](fetch-raw.md) | Возвращает следующую строку без преобразований | 15.5.1 |
| [getIterator](get-iterator.md) | Возвращает итератор для обхода результата в `foreach` | |

### Сведения о результате

| Метод | Описание | С версии |
| --- | --- | --- |
| [getSelectedRowsCount](get-selected-rows-count.md) | Возвращает число строк в результате | 14.0.0 |
| [getFields](get-fields.md) | Возвращает описание колонок результата объектами полей ORM | 14.5.2 |
| [getFieldsCount](get-fields-count.md) | Возвращает число колонок в результате | |
| [getLength](get-length.md) | Возвращает размер последней прочитанной строки в байтах | |
| [hasBigFields](has-big-fields.md) | Проверяет, есть ли в результате колонки больших типов | |
| [getResource](get-resource.md) | Возвращает результат запроса драйвера базы данных | 14.0.0 |
| [getTrackerQuery](get-tracker-query.md) | Возвращает сведения о запросе для отслеживания | 14.0.0 |
| [setCount](set-count.md) | Задает общее число строк | 15.5.10 |
| [getCount](get-count.md) | Возвращает общее число строк, заданное через `setCount` | 15.5.10 |

### Преобразование строк

| Метод | Описание | С версии |
| --- | --- | --- |
| [getConverters](get-converters.md) | Возвращает функции преобразования значений колонок | |
| [setConverters](set-converters.md) | Задает функции преобразования значений колонок | |
| [setSerializedFields](set-serialized-fields.md) | Задает колонки, значения которых нужно десериализовать | 14.0.0 |
| [setReplacedAliases](set-replaced-aliases.md) | Задает переименование колонок в строке | 14.0.0 |
| [addReplacedAliases](add-replaced-aliases.md) | Добавляет переименование колонок к заданному | 14.9.2 |
| [addFetchDataModifier](add-fetch-data-modifier.md) | Добавляет функцию, которая меняет строку при выборке | 14.5.1 |

## Наследование

Класс `Result` реализует интерфейс `IteratorAggregate`, поэтому объект можно обходить в `foreach`.

### Реализации

| Класс | Источник данных | Собственные методы |
| --- | --- | --- |
| [MysqliResult](../mysqli-result/index.md) | Результат запроса MySQL через расширение `mysqli` | Нет |
| [PgsqlResult](../pgsql-result/index.md) | Результат запроса PostgreSQL | Нет |
| `ArrayResult` | Массив строк, переданный в конструктор | Нет |
| `Bitrix\Main\ORM\Query\Result` | Результат запроса ORM. Передает вызовы объекту `Result` соединения | Методы для работы с объектами ORM |

### Что реализовать в наследнике

Наследник реализует абстрактные методы [getFields](get-fields.md) и [getSelectedRowsCount](get-selected-rows-count.md). Защищенный абстрактный метод `fetchRowInternal` код приложения не вызывает, но наследник обязан его реализовать. Метод возвращает следующую строку ассоциативным массивом или `false`, если строк больше нет.

## Смотрите также

- [Connection::query](../connection/query.md)
- [Выполнение запросов](../../../../database/query-execution.md)
