---
title: DataManager — базовый класс таблицы ORM
description: Абстрактный класс Bitrix\Main\ORM\Data\DataManager — родитель всех таблиц ORM. Наследник описывает таблицу и поля, а методы класса выбирают, добавляют, изменяют и удаляют записи.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Data`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.0

{% endnote %}

## Когда использовать

Класс `DataManager` — родитель всех таблиц ORM, например `UserTable` или `LanguageTable`. Чтобы работать со своей таблицей через ORM, создайте наследник. Наследник задает имя таблицы методом [getTableName](get-table-name.md) и описывает поля методом [getMap](get-map.md).

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

class UnitTable extends DataManager
{
    public static function getTableName()
    {
        return 'b_units';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))->configurePrimary()->configureAutocomplete(),
            (new StringField('CODE'))->configureRequired(),
            new StringField('NAME'),
        ];
    }
}
```

Все методы класса статические. Методы работают с таблицей наследника.

- Методы [getList](get-list.md), [getRow](get-row.md), [getById](get-by-id.md) и [getCount](get-count.md) выбирают записи. Метод [query](query.md) возвращает построитель запроса.
- Методы [add](add.md), [update](update.md) и [delete](delete.md) записывают данные. Перед записью методы отправляют события ORM. Методы `add` и `update` еще проверяют поля.
- Методы [createObject](create-object.md) и [wakeUpObject](wake-up-object.md) создают объекты ORM для работы с записью как с объектом.
- Наследник переопределяет методы `get*Class` и [setDefaultScope](set-default-scope.md), чтобы изменить поведение ORM.

Старое имя класса `Bitrix\Main\Entity\DataManager` работает как псевдоним.

Подробнее — в статьях [Концепция ORM](../../../../../orm/orm-concepts.md), [Выборка данных](../../../../../orm/querying-data.md) и [Операции с сущностями и события](../../../../../orm/entity-operations.md).

## Методы класса

### Описание таблицы

| Метод | Описание | С версии |
| --- | --- | --- |
| [getTableName](get-table-name.md) | Возвращает имя таблицы в базе данных | 12.0.7 |
| [getMap](get-map.md) | Возвращает описание полей | 12.0.7 |
| [getConnectionName](get-connection-name.md) | Возвращает имя подключения к базе данных | 12.0.9 |
| [getTitle](get-title.md) | Возвращает название таблицы | |
| [getUfId](get-uf-id.md) | Возвращает идентификатор пользовательских полей | |
| [isUts](is-uts.md) | Отмечает таблицу одиночных пользовательских полей | |
| [isUtm](is-utm.md) | Отмечает таблицу множественных пользовательских полей | |
| [setDefaultScope](set-default-scope.md) | Добавляет условия во все запросы к таблице | |
| [postInitialize](post-initialize.md) | Дополняет сущность после создания | |
| [isCacheable](is-cacheable.md) | Разрешает или запрещает кеш выборок | |
| [getEntity](get-entity.md) | Возвращает сущность ORM | |
| [unsetEntity](unset-entity.md) | Удаляет сущность из памяти класса | |

### Выборка

| Метод | Описание | С версии |
| --- | --- | --- |
| [getList](get-list.md) | Выбирает записи по параметрам | |
| [getRow](get-row.md) | Возвращает одну запись по параметрам | |
| [getByPrimary](get-by-primary.md) | Выбирает запись по первичному ключу | |
| [getById](get-by-id.md) | Выбирает запись по первичному ключу без параметров | |
| [getRowById](get-row-by-id.md) | Возвращает одну запись по первичному ключу | 14.0.0 |
| [getCount](get-count.md) | Возвращает число записей | 12.0.10 |
| [query](query.md) | Создает построитель запроса | |

### Запись

| Метод | Описание | С версии |
| --- | --- | --- |
| [add](add.md) | Добавляет запись | |
| [addMulti](add-multi.md) | Добавляет несколько записей | |
| [update](update.md) | Изменяет запись | |
| [updateMulti](update-multi.md) | Изменяет несколько записей | |
| [delete](delete.md) | Удаляет запись | |
| [checkFields](check-fields.md) | Проверяет значения полей | |
| [cleanCache](clean-cache.md) | Очищает кеш выборок | |
| [setCurrentDeletingObject](set-current-deleting-object.md) | Передает объект, который удаляет себя | |

### Объекты

| Метод | Описание | С версии |
| --- | --- | --- |
| [createObject](create-object.md) | Создает объект новой записи | |
| [createCollection](create-collection.md) | Создает пустую коллекцию | |
| [wakeUpObject](wake-up-object.md) | Создает объект существующей записи | |
| [wakeUpCollection](wake-up-collection.md) | Создает коллекцию существующих записей | |
| [getObjectClass](get-object-class.md) | Возвращает класс объекта | |
| [getObjectClassName](get-object-class-name.md) | Возвращает короткое имя класса объекта | |
| [getCollectionClass](get-collection-class.md) | Возвращает класс коллекции | |
| [getCollectionClassName](get-collection-class-name.md) | Возвращает короткое имя класса коллекции | |
| [getObjectParentClass](get-object-parent-class.md) | Возвращает родительский класс объекта | |
| [getCollectionParentClass](get-collection-parent-class.md) | Возвращает родительский класс коллекции | |
| [getQueryClass](get-query-class.md) | Возвращает класс построителя запроса | |
| [getEntityClass](get-entity-class.md) | Возвращает класс сущности | |

### Шифрование

| Метод | Описание | С версии |
| --- | --- | --- |
| [enableCrypto](enable-crypto.md) | Включает шифрование поля | 17.5.14 |
| [cryptoEnabled](crypto-enabled.md) | Проверяет, включено ли шифрование поля | 17.5.14 |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `EVENT_ON_BEFORE_ADD`, `EVENT_ON_ADD`, `EVENT_ON_AFTER_ADD` | `'OnBeforeAdd'`, `'OnAdd'`, `'OnAfterAdd'` | События метода [add](add.md) |
| `EVENT_ON_BEFORE_UPDATE`, `EVENT_ON_UPDATE`, `EVENT_ON_AFTER_UPDATE` | `'OnBeforeUpdate'`, `'OnUpdate'`, `'OnAfterUpdate'` | События метода [update](update.md) |
| `EVENT_ON_BEFORE_DELETE`, `EVENT_ON_DELETE`, `EVENT_ON_AFTER_DELETE` | `'OnBeforeDelete'`, `'OnDelete'`, `'OnAfterDelete'` | События метода [delete](delete.md) |

## Обработчики событий в наследнике

Наследник может объявить статические методы `onBeforeAdd`, `onAdd`, `onAfterAdd`, `onBeforeUpdate`, `onUpdate`, `onAfterUpdate`, `onBeforeDelete`, `onDelete` и `onAfterDelete`. ORM вызывает метод при событии таблицы и передает ему объект [Event](../../event/index.md). Так таблица обрабатывает свои события без регистрации обработчика.

## Смотрите также

- [Концепция ORM](../../../../../orm/orm-concepts.md)
- [Операции с сущностями и события](../../../../../orm/entity-operations.md)
- [Result](../../query/result/index.md)
- [Event](../../event/index.md)
