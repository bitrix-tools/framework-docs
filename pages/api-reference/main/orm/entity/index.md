---
title: Entity — сущность ORM
description: Класс Bitrix\Main\ORM\Entity описывает сущность ORM — таблицу, поля, первичный ключ, классы объекта и коллекции. Объект сущности возвращает DataManager::getEntity.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.0

{% endnote %}

## Когда использовать

Класс `Entity` описывает сущность ORM — таблицу базы данных, ее поля, первичный ключ, классы объекта и коллекции. Ядро строит сущность по классу таблицы — наследнику [DataManager](../data/data-manager/index.md). Объект сущности один на класс таблицы, его возвращает метод [DataManager::getEntity](../data/data-manager/get-entity.md).

```php
use Bitrix\Main\Localization\LanguageTable;

$entity = LanguageTable::getEntity();

echo $entity->getDBTableName();
echo $entity->getPrimary();
```

Сущность нужна, чтобы прочитать описание полей, построить запрос [Query](../query/query/index.md) или создать сущность на лету методом [compileEntity](compile-entity.md).

Старое имя класса `Bitrix\Main\Entity\Base` работает как псевдоним.

Подробнее — в статье [Концепция ORM](../../../../orm/orm-concepts.md).

{% note warning "" %}

Методы `getUField` и `hasUField` устарели. Пользовательские поля входят в [getFields](get-fields.md). Методы `camel2snake` и `snake2camel` устарели, используйте `Bitrix\Main\Text\StringHelper`. Методы `enableFullTextIndex` и `fullTextIndexEnabled` устарели. Первый ничего не делает, второй всегда возвращает `true`.

{% endnote %}

## Методы класса

### Получение и создание сущности

| Метод | Описание | С версии |
| --- | --- | --- |
| [get](get.md) | Возвращает сущность по имени | |
| [getInstance](get-instance.md) | Возвращает сущность по имени, то же, что `get` | |
| [has](has.md) | Проверяет, есть ли класс таблицы сущности | |
| [isExists](is-exists.md) | Проверяет, есть ли класс таблицы сущности, то же, что `has` | |
| [compileEntity](compile-entity.md) | Создает сущность на лету | |
| [getInstanceByQuery](get-instance-by-query.md) | Создает сущность по запросу | |
| [destroy](destroy.md) | Удаляет сущность из памяти | |

### Инициализация

| Метод | Описание | С версии |
| --- | --- | --- |
| [initialize](initialize.md) | Читает настройки из класса таблицы | |
| [postInitialize](post-initialize.md) | Создает поля и первичный ключ | |
| [reinitialize](reinitialize.md) | Привязывает сущность к другому классу таблицы | |
| [initializeField](initialize-field.md) | Создает поле по описанию | |
| [addField](add-field.md) | Добавляет поле в сущность | |

### Сведения о сущности

| Метод | Описание | С версии |
| --- | --- | --- |
| [getName](get-name.md) | Возвращает короткое имя сущности | |
| [getFullName](get-full-name.md) | Возвращает полное имя сущности | |
| [getNamespace](get-namespace.md) | Возвращает пространство имен | |
| [getModule](get-module.md) | Возвращает модуль | |
| [getDataClass](get-data-class.md) | Возвращает класс таблицы | |
| [getCode](get-code.md) | Возвращает код сущности | |
| [getLangCode](get-lang-code.md) | Возвращает код языковой фразы названия | |
| [getTitle](get-title.md) | Возвращает название сущности | |
| [getConnection](get-connection.md) | Возвращает соединение с базой данных | |
| [getDBTableName](get-db-table-name.md) | Возвращает имя таблицы | |
| [getPrimary](get-primary.md) | Возвращает первичный ключ | |
| [getPrimaryArray](get-primary-array.md) | Возвращает поля первичного ключа массивом | |
| [getAutoIncrement](get-auto-increment.md) | Возвращает поле с автоинкрементом | |
| [isUts](is-uts.md) | Проверяет, хранит ли таблица одиночные пользовательские поля | |
| [isUtm](is-utm.md) | Проверяет, хранит ли таблица множественные пользовательские поля | |
| [getUfId](get-uf-id.md) | Возвращает объект пользовательских полей | |
| [setDefaultScope](set-default-scope.md) | Добавляет в запрос условия по умолчанию | |

### Поля

| Метод | Описание | С версии |
| --- | --- | --- |
| [getFields](get-fields.md) | Возвращает все поля | |
| [getField](get-field.md) | Возвращает поле по имени | |
| [hasField](has-field.md) | Проверяет, есть ли поле | |
| [getScalarFields](get-scalar-fields.md) | Возвращает скалярные поля | |
| [getReferencesCountTo](get-references-count-to.md) | Возвращает число связей с другой сущностью | |
| [getReferencesTo](get-references-to.md) | Возвращает связи с другой сущностью | |

### Объекты и коллекции

| Метод | Описание | С версии |
| --- | --- | --- |
| [getObjectClass](get-object-class.md) | Возвращает полное имя класса объекта | |
| [getObjectClassName](get-object-class-name.md) | Возвращает короткое имя класса объекта | |
| [getDefaultObjectClassName](get-default-object-class-name.md) | Возвращает имя класса объекта по умолчанию | |
| [getCollectionClass](get-collection-class.md) | Возвращает полное имя класса коллекции | |
| [getCollectionClassName](get-collection-class-name.md) | Возвращает короткое имя класса коллекции | |
| [getDefaultCollectionClassName](get-default-collection-class-name.md) | Возвращает имя класса коллекции по умолчанию | |
| [createObject](create-object.md) | Создает объект | |
| [createCollection](create-collection.md) | Создает коллекцию | |
| [wakeUpObject](wake-up-object.md) | Создает объект из готовых данных | |
| [wakeUpCollection](wake-up-collection.md) | Создает коллекцию из готовых данных | |
| [compileObjectClass](compile-object-class.md) | Создает класс объекта, если его нет | |
| [compileCollectionClass](compile-collection-class.md) | Создает класс коллекции, если его нет | |

### Имена классов

| Метод | Описание | С версии |
| --- | --- | --- |
| [normalizeEntityClass](normalize-entity-class.md) | Приводит имя к классу таблицы | |
| [normalizeName](normalize-name.md) | Приводит имя к имени сущности | |
| [getEntityClassParts](get-entity-class-parts.md) | Делит имя на пространство имен и имя сущности | |

### Таблица в базе данных

| Метод | Описание | С версии |
| --- | --- | --- |
| [compileDbTableStructureDump](compile-db-table-structure-dump.md) | Возвращает SQL создания таблицы | |
| [createDbTable](create-db-table.md) | Создает таблицу в базе данных | 14.5.1 |

### Кеш выборок

| Метод | Описание | С версии |
| --- | --- | --- |
| [readFromCache](read-from-cache.md) | Читает результат выборки из кеша | 16.5.10 |
| [writeToCache](write-to-cache.md) | Пишет результат выборки в кеш | |
| [getCacheTtl](get-cache-ttl.md) | Возвращает время жизни кеша | 16.5.10 |
| [cleanCache](clean-cache.md) | Очищает кеш выборок сущности | 16.5.10 |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `DEFAULT_OBJECT_PREFIX` | `'EO_'` | Префикс имен классов объекта и коллекции по умолчанию |

## Смотрите также

- [DataManager](../data/data-manager/index.md)
- [Концепция ORM](../../../../orm/orm-concepts.md)
- [Объекты](../../../../orm/objects.md)
