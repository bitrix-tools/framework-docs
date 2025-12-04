---
title: Построитель запросов
description: 'Построитель запросов. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Методы выборки `getList` и `getRow` сразу выполняют запросы и возвращают результаты. Они подходят для простых запросов, но неудобны, если параметры неизвестны заранее или нужна сложная логика.

**Гибкость с Entity\\Query.** Для гибкой настройки запросов используйте объект `Entity\Query`(далее -- `Query`). Он накапливает параметры для запроса. Это полезно, когда параметры неизвестны заранее и формируются программно.

Пример с `getList`

```php
// получение данных через getList
$result = BookTable::getList([
    'select' => ['ISBN', 'TITLE', 'PUBLISH_DATE'],
    'filter' => ['=ID' => 1]
]);
```

Пример с `Entity\Query`

```php
// аналогичный запрос через Entity\Query
$q = new Entity\Query(BookTable::getEntity());
$q->setSelect(['ISBN', 'TITLE', 'PUBLISH_DATE']);
$q->setFilter(['=ID' => 1]);
$result = $q->exec();
```

Объект `Query` -- ключевой элемент для выборки данных и используется внутри `getList`. Однако переопределение методов `getList` может быть ограничено: метод может сработать при вызове, но не через `Query`.

## Постепенное добавление параметров

Если вы не знаете заранее, какие поля выбрать или какие фильтры применить, используйте объект `Query` для постепенного добавления параметров.

```php
$query = new Entity\Query(BookTable::getEntity());
attachSelect($query);
attachOthers($query);
$result = $query->exec();

// Функция для добавления полей в запрос
function attachSelect(Entity\Query $query): void
{
    $query->addSelect('ID');
    
    // Условие для добавления поля ISBN
    if (/* условие */) {
        $query->addSelect('ISBN');
    }
}

function attachOthers(Entity\Query $query): void
{
    // Условие для добавления фильтра
    if (/* условие */) {
        $query->setFilter(/* параметры фильтра */);
    }
    
    // Условие для добавления сортировки
    if (/* условие */) {
        $query->setOrder(/* параметры сортировки */);
    }
}
```

**Создание объекта Query**. Используем `new Entity\Query(BookTable::getEntity())` для создания нового объекта `Query`, связанного с сущностью `BookTable`. Это будет основой для построения запроса.

**Добавление полей в запрос**. Функция `attachSelect` добавляет поля, которые нужно выбрать из базы данных.

-  `addSelect('ID')` добавляет поле `ID` в список выбираемых полей

-  Условие внутри функции добавляет поле `ISBN`, если оно необходимо

**Добавление фильтров и сортировки**. Функция `attachOthers` добавляет фильтры и сортировку.

-  `setFilter` устанавливает условия фильтрации данных

-  `setOrder` задает порядок сортировки результатов

## Запрос без выполнения

Объект `Query` позволяет строить запрос без его выполнения. Это полезно для подзапросов или получения текста запроса:

```php
$q = new Entity\Query(BookTable::getEntity());
$q->setSelect(['ID']);
$q->setFilter(['=PUBLISH_DATE' => new Type\Date('2014-12-13', 'Y-m-d')]);
$sql = $q->getQuery();
file_put_contents('/tmp/today_books.sql', $sql);
// Запрос "SELECT ID FROM my_book WHERE PUBLISH_DATE='2014-12-31'" будет сохранен в файл, но не выполнен.
```

## Методы Entity\\Query

**select, group**

-  `setSelect`, `setGroup` -- задает список полей, полностью заменяя предыдущие

-  `addSelect`, `addGroup` -- добавляет новые поля к существующему списку

-  `getSelect`, `getGroup` -- возвращает массив полей

**filter**

-  `setFilter` -- устанавливает фильтр

-  `addFilter` -- добавляет параметр фильтра

-  `getFilter` -- возвращает фильтр

**order**

-  `setOrder` -- устанавливает порядок сортировки

-  `addOrder` -- добавляет поле для сортировки

-  `getOrder` -- возвращает порядок сортировки

**limit/offset**

-  `setLimit`, `setOffset` -- устанавливает значение

-  `getLimit`, `getOffset` -- возвращает значение

**runtime fields**

-  `registerRuntimeField` -- регистрирует временное поле
