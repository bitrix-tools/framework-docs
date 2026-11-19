---
title: MysqliResult — результат запроса MySQL
description: Класс Bitrix\Main\DB\MysqliResult реализует результат запроса для MySQL через расширение mysqli.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

## Когда использовать

Класс `MysqliResult` — реализация [Result](../result/index.md) для MySQL. Объект возвращает метод [query](../connection/query.md) соединения `MysqliConnection`, создавать его конструктором не нужно. Класс читает строки через объект `mysqli_result`.

Класс [Result](../result/index.md) описывает все методы, которые вызывает код приложения. Собственных методов у класса нет.

## Наследование

Класс наследует [Result](../result/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| [getSelectedRowsCount](../result/get-selected-rows-count.md) | Возвращает свойство `num_rows` результата `mysqli`. Для запроса без выборки возвращает `0` |
| [getFieldsCount](../result/get-fields-count.md) | Возвращает свойство `field_count` результата `mysqli`. Для запроса без выборки возвращает `0` |
| [getLength](../result/get-length.md) | Возвращает сумму длин значений последней прочитанной строки. Вызывайте после `fetch` или `fetchRaw`, которые вернули строку |
| [hasBigFields](../result/has-big-fields.md) | Возвращает `true`, если в результате есть колонка типа `BLOB`, или колонка `JSON` при определенной константе `MYSQLI_TYPE_JSON`. Без соединения возвращает `false` |
| [getFields](../result/get-fields.md) | Строит объекты полей по типам колонок `mysqli`. Ключи — имена колонок, как в результате |

### Унаследованные методы

Методы чтения строк, преобразования значений и общего числа строк работают как в классе [Result](../result/index.md#методы-класса).

## Смотрите также

- [Result](../result/index.md)
- [PgsqlResult](../pgsql-result/index.md)
- [MysqliConnection](../mysqli-connection/index.md)
