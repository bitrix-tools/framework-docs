---
title: Collection — операции над массивами
description: Класс Bitrix\Main\Type\Collection сортирует массив по колонкам, читает и меняет значения по вложенному ключу и выполняет другие частые операции над массивами.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Type`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Collection` содержит статические методы для операций над массивами, которых нет среди стандартных функций PHP. Метод [sortByColumn](sort-by-column.md) сортирует список строк по одной или нескольким колонкам. Методы [getByNestedKey](get-by-nested-key.md), [setByNestedKey](set-by-nested-key.md) и [unsetByNestedKey](unset-by-nested-key.md) работают со значением по пути из ключей.

Все методы класса статические. Объект класса создавать не нужно.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [sortByColumn](sort-by-column.md) | Сортирует массив строк по колонкам | |
| [getByNestedKey](get-by-nested-key.md) | Возвращает значение по пути из ключей | |
| [setByNestedKey](set-by-nested-key.md) | Записывает значение по пути из ключей | |
| [unsetByNestedKey](unset-by-nested-key.md) | Удаляет элемент по пути из ключей | |
| [firstNotEmpty](first-not-empty.md) | Возвращает первое непустое значение из пар «массив — ключ» | 14.0.4 |
| [normalizeArrayValuesByInt](normalize-array-values-by-int.md) | Оставляет в массиве уникальные положительные целые числа | 14.5.4 |
| [isAssociative](is-associative.md) | Проверяет, ассоциативный ли массив | 14.5.4 |
| [clone](clone.md) | Копирует массив вместе с вложенными массивами и объектами | |

## Смотрите также

- [Collection::sortByColumn](sort-by-column.md)
- [Collection::getByNestedKey](get-by-nested-key.md)
