---
title: Cache — кеширование данных и вывода
description: Класс Bitrix\Main\Data\Cache сохраняет в кеш данные и HTML-вывод фрагмента кода и возвращает их, пока не истечет время жизни кеша.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Data`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Cache` сохраняет в кеш результат фрагмента кода — данные и HTML-вывод — и возвращает их при следующих запросах, пока не истечет время жизни кеша. Секция `cache` файла `.settings.php` задает механизм хранения — файлы, Redis, Memcache или APCu.

Метод [createInstance](create-instance.md) создает объект. Работа с кешем идет в три шага.

1. Метод [initCache](init-cache.md) проверяет, есть ли действующий кеш по ключу.
2. Если кеш есть, метод [getVars](get-vars.md) возвращает данные, а [output](output.md) выводит сохраненный HTML.
3. Если кеша нет, методы [startDataCache](start-data-cache.md) и [endDataCache](end-data-cache.md) сохраняют новые данные.

Метод [cleanDir](clean-dir.md) удаляет кеш целого каталога, например после изменения данных.

Аналог в классическом API — класс `CPHPCache`.

Подробнее — в статье [Кеширование](../../../../performance/caching.md).

{% note warning "" %}

Метод `clearCache` устарел. Если передать ему `true` или каталог, метод вызывает `cleanDir`. Без аргументов метод ничего не удаляет. Для нового кода используйте [cleanDir](clean-dir.md).

{% endnote %}

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [createInstance](create-instance.md) | Создает объект кеша с механизмом хранения из настроек | |
| [__construct](construct.md) | Создает объект кеша с переданным механизмом хранения | |
| [initCache](init-cache.md) | Проверяет кеш по ключу и читает его | |
| [getVars](get-vars.md) | Возвращает данные из кеша | |
| [output](output.md) | Выводит HTML из кеша | |
| [noOutput](no-output.md) | Отключает перехват и вывод HTML | |
| [startDataCache](start-data-cache.md) | Начинает запись кеша или выводит готовый кеш | |
| [endDataCache](end-data-cache.md) | Сохраняет данные и HTML в кеш | |
| [abortDataCache](abort-data-cache.md) | Отменяет запись кеша | |
| [isStarted](is-started.md) | Проверяет, идет ли запись кеша | |
| [forceRewriting](force-rewriting.md) | Включает перезапись кеша без чтения | 14.0.2 |
| [clean](clean.md) | Удаляет кеш по ключу | |
| [cleanDir](clean-dir.md) | Удаляет кеш каталога | |
| [isCacheExpired](is-cache-expired.md) | Проверяет, истек ли кеш по пути к файлу | |
| [getPath](get-path.md) | Возвращает путь к файлу кеша по ключу | |
| [getSalt](get-salt.md) | Возвращает часть каталога кеша по имени скрипта | |
| [createCacheEngine](create-cache-engine.md) | Создает механизм хранения из настроек | |
| [getCacheEngineType](get-cache-engine-type.md) | Возвращает тип механизма хранения | |
| [shouldClearCache](should-clear-cache.md) | Проверяет, нужно ли пропустить чтение кеша | 14.0.2 |
| [setClearCache](set-clear-cache.md) | Пропускает чтение кеша на этом запросе | |
| [setClearCacheSession](set-clear-cache-session.md) | Пропускает чтение кеша до конца сессии | |
| [setShowCacheStat](set-show-cache-stat.md) | Включает сбор статистики кеша | |
| [getShowCacheStat](get-show-cache-stat.md) | Проверяет, включен ли сбор статистики | |

## Смотрите также

- [Кеширование](../../../../performance/caching.md)
- [SessionLocalStorage](../local-storage/session-local-storage/index.md)
