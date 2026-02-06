---
title: Временное хранение
description: 'Временное хранение. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

В некоторых сценариях нужно сохранить данные на определенный срок и гарантировать их доступность для чтения. Для этого используют:

-  сессии — подходят для хранения данных в рамках одной пользовательской сессии, но очищаются после завершения сессии,

-  кеш — оптимален для временного хранения результатов вычислений, но данные могут быть удалены в любой момент,

-  файлы — подходят для больших объемов данных, но требуют дисковых операций и работают медленнее.

Bitrix Framework предлагает два решения для управляемого временного хранения:

-  `PersistentStorageInterface` — хранилище с гарантированным сроком хранения. Подходит для случаев, когда важно сохранить данные на заданный срок.

-  `DeferredStorageDecorator` — декоратор с отложенным сохранением. Подходит для сценариев с большим количеством операций записи, где допустима потеря данных из-за сбоев при выполнении хита.

{% note info "" %}

Можно использовать с версии main 25.1100.0.

{% endnote %}

## Архитектура

Хранилища основаны на стандарте PSR-16 (SimpleCache). Стандарт задает единый интерфейс работы с временными данными и упрощает замену реализаций.

На его основе используется следующая иерархия интерфейсов:

-  `\Bitrix\Main\Data\Storage\StorageInterface` — расширяет `Psr\SimpleCache\CacheInterface`,

-  `\Bitrix\Main\Data\Storage\PersistentStorageInterface` — расширяет `StorageInterface`, добавляет гарантии хранения данных.

Реализация включает два основных класса.

1. `ConnectionBasedPersistentStorage` — хранит данные в базе данных и реализует `PersistentStorageInterface`,

2. `DeferredStorageDecorator` — добавляет отложенную запись поверх любого `StorageInterface`.

## Гарантированное хранилище с временным хранением

Интерфейс `PersistentStorageInterface` позволяет сохранять данные с заданным временем жизни и быть уверенным, что они не исчезнут раньше срока.

### Получить хранилище

Чтобы создать объект хранилища, используйте Service Locator.

```php
$storage = \Bitrix\Main\DI\ServiceLocator::getInstance()
    ->get(\Bitrix\Main\Data\Storage\PersistentStorageInterface::class);
```

{% note tip "" %}

Подробнее в статье [Service Locator](./service-locator)

{% endnote %}

### Установить значение

Метод `set($key, $value, $ttl = null)` сохраняет значение по указанному ключу.

-  `$key` — строка до 255 символов. Используйте формат `модуль.фича.уникальный_ключ`, например, `mymodule.feature_processing.feature123`.

-  `$value` — любые данные, которые можно преобразовать в JSON.

-  `$ttl` — время жизни записи. Можно передать `null`, `int` в секундах или объект `\DateInterval`. Не рекомендуется использовать время жизни больше `604800` секунд (семь суток).

```php
$storage = \Bitrix\Main\DI\ServiceLocator::getInstance()
    ->get(\Bitrix\Main\Data\Storage\PersistentStorageInterface::class);

$storage->set('mymodule.feature_processing.feature123', ['somedata' => 12345], 3600);

// Пример с DateInterval
$interval = new \DateInterval('P1D');
$storage->set('key', 'value', $interval);
```

### Прочитать значение

Метод `get($key, $default = null)` получает значение по ключу `$key`. Если ключ не найден или истек его срок, возвращает `$default`.

-  `$key` — ключ для поиска значения.

-  `$default` — значение, которое вернется, если ключ не найден.

```php
$storage = \Bitrix\Main\DI\ServiceLocator::getInstance()
    ->get(\Bitrix\Main\Data\Storage\PersistentStorageInterface::class);

$value = $storage->get('mymodule.feature_processing.feature123', 'default value');

// Если 'mymodule.feature_processing.feature123' существует, $value будет содержать сохраненные данные
// Если нет — $value будет содержать значение по умолчанию 'default value'
```

### Удалить значение

Метод `delete($key)` удаляет запись по указанному ключу.

-  `$key` — ключ записи, которую нужно удалить.

```php
$storage->delete('mymodule.feature_processing.feature123');
// Запись с ключом 'mymodule.feature_processing.feature123' удалена из хранилища
```

### Прочитать несколько значений

Метод `getMultiple($keys, $default = null)` получает несколько значений по массиву ключей.

-  `$keys` — массив ключей.

-  `$default` — значение, которое вернется для ключей, которые не найдены.

```php
$values = $storage->getMultiple([
    'mymodule.feature_processing.feature123',
    'mymodule.feature_processing.feature456',
    'mymodule.feature_processing.feature789'
], 'not found');
/*
Возвращает массив: [
    'mymodule.feature_processing.feature123' => 'значение1',
    'mymodule.feature_processing.feature456' => 'not found',
    'mymodule.feature_processing.feature789' => 'значение3'
]
*/
```

### Записать несколько значений

Метод `setMultiple($values, $ttl = null)` записывает несколько значений одновременно.

-  `$values` — массив вида `['ключ' => 'значение']`.

-  `$ttl` — время жизни для всех записываемых значений.

```php
$storage->setMultiple([
    'mymodule.feature_processing.feature123' => 'value1',
    'mymodule.feature_processing.feature456' => 'value2',
    'mymodule.feature_processing.feature789' => 'value3'
], 3600);
// Все три записи сохранены с TTL 3600 секунд
```

### Удалить несколько значений

Метод `deleteMultiple($keys)` удаляет несколько записей одновременно.

-  `$keys` — массив ключей для удаления.

```php
$storage->deleteMultiple([
    'mymodule.feature_processing.feature123',
    'mymodule.feature_processing.feature456',
    'mymodule.feature_processing.feature789'
]);
// Три записи удалены из хранилища
```

## Декоратор с отложенным сохранением

`DeferredStorageDecorator` накапливает изменения в памяти и записывает их в базу данных одним пакетом. Это снижает количество операций записи и повышает производительность.

Используйте декоратор, если выполняете много операций `set` и можете допустить потерю данных при аварийном завершении процесса.

```php
// Получаем базовое хранилище
$baseStorage = \Bitrix\Main\DI\ServiceLocator::getInstance()
    ->get(\Bitrix\Main\Data\Storage\PersistentStorageInterface::class);

// Создаем декоратор с отложенным сохранением
$deferredStorage = new \Bitrix\Main\Data\Storage\DeferredStorageDecorator($baseStorage);

// Устанавливаем первое значение - данные пока только в памяти
$deferredStorage->set('mymodule.feature_processing.feature123', 'somedata', 3600);

// Устанавливаем второе значение - данные все еще в памяти
$deferredStorage->set('mymodule.feature_processing.feature456', ['somedata' => 12345], 3600);

// Явно сохраняем все накопленные данные в БД
$deferredStorage->save();
```

Декоратор поддерживает все методы, аналогично `PersistentStorageInterface` и добавляет два метода для управления отложенной записью.

### Создать декоратор

Чтобы создать декоратор, передайте ему базовое хранилище.

```php
$baseStorage = \Bitrix\Main\DI\ServiceLocator::getInstance()
    ->get(\Bitrix\Main\Data\Storage\PersistentStorageInterface::class);

$deferredStorage = new \Bitrix\Main\Data\Storage\DeferredStorageDecorator($baseStorage);
```

### Сохранить отложенные изменения

Метод `save()` сохраняет все отложенные изменения в базу данных. Используйте, если нужно контролировать момент записи.

```php
$deferredStorage->set('mymodule.feature_processing.feature123', 'value1', 3600);
$deferredStorage->set('mymodule.feature_processing.feature456', 'value2', 3600);
// Данные пока не сохранены в базе данных, они находятся в памяти

// Сохраняем все изменения в базу данных
$deferredStorage->save();
```

{% note warning "" %}

Декоратор автоматически вызывает `save()` при уничтожении объекта, но для надежности лучше вызывать его явно.

{% endnote %}

### Сбросить кешированное значение

Метод `reset($key)` удаляет значение из внутреннего кеша. Следующий `get()` прочитает данные напрямую из из базового хранилища. Это полезно, если данные могут измениться другим процессом.

-  `$key` — ключ, значение которого нужно сбросить из кеша.

```php
// Устанавливаем значение
$deferredStorage->set('key', 'value', 3600);

// Первое чтение — значение берется из памяти
$value1 = $deferredStorage->get('key');

// Сбрасываем кешированное значение
$deferredStorage->reset('key');

// Второе чтение — значение будет прочитано из базы данных
$value2 = $deferredStorage->get('key');
```