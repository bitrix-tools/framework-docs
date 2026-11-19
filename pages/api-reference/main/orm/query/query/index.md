---
title: Query — построитель запросов ORM
description: Класс Bitrix\Main\ORM\Query\Query строит и выполняет SQL-запрос к сущности ORM — выборку полей, фильтр, группировку, сортировку, постраничность и объединение.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Query`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.0

{% endnote %}

## Когда использовать

Класс `Query` строит SQL-запрос к сущности ORM и выполняет его. Метод `query()` класса таблицы возвращает объект запроса. Методы запроса задают поля, условия, группировку, сортировку и лимит. Каждый метод возвращает тот же объект, поэтому вызовы можно записывать подряд.

```php
use Bitrix\Main\Localization\LanguageTable;

$languages = LanguageTable::query()
    ->setSelect(['LID', 'NAME'])
    ->where('ACTIVE', 'Y')
    ->setOrder(['SORT' => 'ASC'])
    ->setLimit(10)
    ->fetchAll();
```

Метод `DataManager::getList` строит такой же объект из массива параметров. `Query` нужен, когда код собирает параметры по шагам или нужны объединение, подзапрос и другие возможности, которых нет в `getList`.

Методы `where*` и `having*` задают условия. `Query` передает их в дерево условий, поэтому их описывает страница [ConditionTree](../filter/condition-tree/index.md). Запрос передает методы `with*` классу таблицы, если тот их объявил.

Подробнее — в статье [Построитель запросов](../../../../../orm/query-builder.md).

## Методы класса

### Создание и выполнение

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает запрос к сущности | |
| [exec](exec.md) | Выполняет запрос и возвращает результат | |
| [fetch](fetch.md) | Выполняет запрос и возвращает первую строку | |
| [fetchAll](fetch-all.md) | Выполняет запрос и возвращает все строки | |
| [fetchObject](fetch-object.md) | Выполняет запрос и возвращает первый объект | |
| [fetchCollection](fetch-collection.md) | Выполняет запрос и возвращает коллекцию | |
| [getQuery](get-query.md) | Возвращает текст SQL-запроса | |
| [getLastQuery](get-last-query.md) | Возвращает текст последнего выполненного запроса | |
| [getEntity](get-entity.md) | Возвращает сущность запроса | |
| [dump](dump.md) | Выводит отладочные сведения о запросе | |

### Поля выборки

| Метод | Описание | С версии |
| --- | --- | --- |
| [getSelect](get-select.md) | Возвращает поля выборки | |
| [setSelect](set-select.md) | Задает поля выборки | |
| [addSelect](add-select.md) | Добавляет поле в выборку | |
| [registerRuntimeField](register-runtime-field.md) | Добавляет поле только для этого запроса | |
| [setDistinct](set-distinct.md) | Включает `DISTINCT` | |
| [hasDistinct](has-distinct.md) | Проверяет, есть ли `DISTINCT` | |
| [expr](expr.md) | Возвращает помощник для коротких выражений | |

### Фильтр

| Метод | Описание | С версии |
| --- | --- | --- |
| [getFilter](get-filter.md) | Возвращает фильтр-массив | |
| [setFilter](set-filter.md) | Задает фильтр-массив | |
| [addFilter](add-filter.md) | Добавляет условие в фильтр-массив | |
| [getFilterHandler](get-filter-handler.md) | Возвращает дерево условий запроса | |
| [filter](filter.md) | Создает новое дерево условий | |
| [buildFilterSql](build-filter-sql.md) | Строит SQL условия `WHERE` | 16.5.10 |

### Группировка и сортировка

| Метод | Описание | С версии |
| --- | --- | --- |
| [getGroup](get-group.md) | Возвращает поля группировки | |
| [setGroup](set-group.md) | Задает поля группировки | |
| [addGroup](add-group.md) | Добавляет поле группировки | |
| [hasAggregation](has-aggregation.md) | Проверяет, есть ли в запросе агрегация | |
| [getOrder](get-order.md) | Возвращает сортировку | |
| [setOrder](set-order.md) | Задает сортировку | |
| [addOrder](add-order.md) | Добавляет поле сортировки | |

### Постраничность

| Метод | Описание | С версии |
| --- | --- | --- |
| [getLimit](get-limit.md) | Возвращает лимит | |
| [setLimit](set-limit.md) | Задает лимит | |
| [getOffset](get-offset.md) | Возвращает смещение | |
| [setOffset](set-offset.md) | Задает смещение | |
| [countTotal](count-total.md) | Включает подсчет общего числа записей | |
| [queryCountTotal](query-count-total.md) | Считает общее число записей отдельным запросом | |

### Объединение запросов

| Метод | Описание | С версии |
| --- | --- | --- |
| [union](union.md) | Добавляет запрос в `UNION` | |
| [unionAll](union-all.md) | Добавляет запрос в `UNION ALL` | |
| [setUnionOrder](set-union-order.md) | Задает сортировку объединения | |
| [addUnionOrder](add-union-order.md) | Добавляет поле сортировки объединения | |
| [setUnionLimit](set-union-limit.md) | Задает лимит объединения | |
| [setUnionOffset](set-union-offset.md) | Задает смещение объединения | |

### Кеш

| Метод | Описание | С версии |
| --- | --- | --- |
| [setCacheTtl](set-cache-ttl.md) | Включает кеш выборок | |
| [cacheJoins](cache-joins.md) | Разрешает кеш выборок для запросов со связями | 16.5.10 |

### Связи 1:N и приватные поля

| Метод | Описание | С версии |
| --- | --- | --- |
| [enableDataDoubling](enable-data-doubling.md) | Разрешает дублирование строк по связям 1:N | |
| [disableDataDoubling](disable-data-doubling.md) | Заменяет связи 1:N в фильтре подзапросом | |
| [enablePrivateFields](enable-private-fields.md) | Разрешает приватные поля в выборке | |
| [disablePrivateFields](disable-private-fields.md) | Запрещает приватные поля | |
| [isPrivateFieldsEnabled](is-private-fields-enabled.md) | Проверяет, разрешены ли приватные поля | |
| [isFieldPrivate](is-field-private.md) | Проверяет, приватное ли поле | |

### Псевдонимы и таблица

| Метод | Описание | С версии |
| --- | --- | --- |
| [setTableAliasPostfix](set-table-alias-postfix.md) | Задает суффикс псевдонимов таблиц | |
| [getTableAliasPostfix](get-table-alias-postfix.md) | Возвращает суффикс псевдонимов таблиц | |
| [setCustomBaseTableAlias](set-custom-base-table-alias.md) | Задает псевдоним основной таблицы | 16.5.10 |
| [getInitAlias](get-init-alias.md) | Возвращает псевдоним основной таблицы | |
| [getReplacedAliases](get-replaced-aliases.md) | Возвращает замененные длинные псевдонимы полей | |
| [quoteTableSource](quote-table-source.md) | Экранирует имя таблицы | |

### Цепочки полей

Цепочка описывает путь к полю через связи, например `GROUPS.GROUP_ID`. Запрос строит цепочки при подготовке SQL. Методы нужны для отладки и для кода, который разбирает запрос.

| Метод | Описание | С версии |
| --- | --- | --- |
| [registerChain](register-chain.md) | Регистрирует цепочку в разделе запроса | |
| [getRegisteredChain](get-registered-chain.md) | Возвращает цепочку по имени поля | |
| [getChains](get-chains.md) | Возвращает все цепочки | |
| [getSelectChains](get-select-chains.md) | Возвращает цепочки выборки | |
| [getFilterChains](get-filter-chains.md) | Возвращает цепочки фильтра | |
| [getWhereChains](get-where-chains.md) | Возвращает цепочки `WHERE` | |
| [getHavingChains](get-having-chains.md) | Возвращает цепочки `HAVING` | |
| [getGroupChains](get-group-chains.md) | Возвращает цепочки группировки | |
| [getOrderChains](get-order-chains.md) | Возвращает цепочки сортировки | |
| [getHiddenChains](get-hidden-chains.md) | Возвращает скрытые цепочки выражений | |
| [getRuntimeChains](get-runtime-chains.md) | Возвращает цепочки полей запроса | |
| [getJoinMap](get-join-map.md) | Возвращает список соединений таблиц | |
| [hasBackReference](has-back-reference.md) | Проверяет, есть ли обратные связи | |
| [setFilterChains](set-filter-chains.md) | Строит цепочки фильтра-массива | |
| [setFilterHandlerChains](set-filter-handler-chains.md) | Строит цепочки дерева условий | |

### Служебные обратные вызовы

| Метод | Описание | С версии |
| --- | --- | --- |
| [booleanStrongEqualityCallback](boolean-strong-equality-callback.md) | Строит SQL сравнения с логическим значением | |
| [nullEqualityCallback](null-equality-callback.md) | Строит SQL сравнения с `NULL` | |
| [dataDoublingCallback](data-doubling-callback.md) | Строит SQL `IN` с подзапросом | |
| [fetchDataModificationCallback](fetch-data-modification-callback.md) | Меняет строку результата обработчиками полей | 14.5.1 |
| [isFetchModificationRequired](is-fetch-modification-required.md) | Проверяет, нужны ли обработчики строк | 14.5.1 |

## Смотрите также

- [Построитель запросов](../../../../../orm/query-builder.md)
- [ConditionTree](../filter/condition-tree/index.md)
- [Result](../result/index.md)
- [Entity](../../entity/index.md)
