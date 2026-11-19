---
title: Result — результат ORM-выборки
description: Класс Bitrix\Main\ORM\Query\Result возвращают getList и Query::exec. Он читает строки массивами, объектами ORM и коллекциями.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Query`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Метод `getList` таблицы ORM и метод `exec` объекта `Query` возвращают объект `Result`. Объект читает строки выборки тремя способами.

- Методы [fetch](fetch.md) и [fetchAll](fetch-all.md) возвращают строки массивами.
- Метод [fetchObject](fetch-object.md) возвращает строку объектом ORM, например `EO_User`.
- Метод [fetchCollection](fetch-collection.md) возвращает все строки коллекцией объектов.

Класс наследует [DB\Result](../../../db/result/index.md) и оборачивает результат запроса к базе данных. Большинство методов передают вызов этому результату. Собственная логика класса — чтение объектов, общий реестр объектов и скрытие служебных полей.

Все способы читают строки из одного курсора. Если вызвать `fetchObject`, а затем `fetch`, метод `fetch` вернет следующую строку. Исключение — запрос с обратной связью `OneToMany` или `ManyToMany`. После первого `fetchObject` такой результат содержит готовые объекты, и смешивать способы чтения нельзя.

Подробнее — в статьях [Выборка данных](../../../../../orm/querying-data.md), [Объекты](../../../../../orm/objects.md) и [Коллекции](../../../../../orm/collections.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает результат по запросу и результату базы данных | |
| [fetch](fetch.md) | Возвращает следующую строку массивом | |
| [fetchAll](fetch-all.md) | Возвращает все оставшиеся строки массивом | |
| [fetchRaw](fetch-raw.md) | Возвращает следующую строку без преобразований | |
| [fetchObject](fetch-object.md) | Возвращает следующую строку объектом ORM | |
| [fetchCollection](fetch-collection.md) | Возвращает все оставшиеся строки коллекцией объектов | |
| [getIterator](get-iterator.md) | Возвращает итератор для `foreach` | |
| [setIdentityMap](set-identity-map.md) | Задает реестр объектов | |
| [getIdentityMap](get-identity-map.md) | Возвращает реестр объектов | |
| [setHiddenObjectFields](set-hidden-object-fields.md) | Задает поля, которые нужны объекту, но скрыты в массиве | |
| [getSelectedRowsCount](get-selected-rows-count.md) | Возвращает число строк в выборке | |
| [setCount](set-count.md) | Задает общее число строк | |
| [getCount](get-count.md) | Возвращает общее число строк без учета `limit` | |
| [getFields](get-fields.md) | Возвращает описание колонок результата | |
| [getResource](get-resource.md) | Возвращает результат драйвера базы данных | |
| [getTrackerQuery](get-tracker-query.md) | Возвращает сведения о запросе для отслеживания | |
| [getConverters](get-converters.md) | Возвращает функции преобразования значений | |
| [setConverters](set-converters.md) | Задает функции преобразования значений | |
| [setSerializedFields](set-serialized-fields.md) | Задает колонки с сериализованными значениями | |
| [setReplacedAliases](set-replaced-aliases.md) | Задает переименование колонок | |
| [addReplacedAliases](add-replaced-aliases.md) | Добавляет переименование колонок | |
| [addFetchDataModifier](add-fetch-data-modifier.md) | Добавляет функцию, которая меняет строку | |

## Смотрите также

- [Выборка данных](../../../../../orm/querying-data.md)
- [DB\Result](../../../db/result/index.md)
- [ExpressionField](../../fields/expression-field/index.md)
