---
title: Application — объект приложения
description: Класс Bitrix\Main\Application — точка входа ядра. Объект дает доступ к контексту запроса, соединению с базой данных, кешу, сессиям и фоновым задачам.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Application` — точка входа ядра. Объект приложения один на весь запрос, его возвращает метод [getInstance](get-instance.md). Через объект код получает контекст запроса, соединение с базой данных, кеш, сессии и добавляет фоновые задачи.

```php
use Bitrix\Main\Application;

$application = Application::getInstance();
$request = $application->getContext()->getRequest();
$connection = Application::getConnection();
```

Класс абстрактный. Для запросов через браузер и AJAX ядро создает наследника `Bitrix\Main\HttpApplication`. Пролог ядра готовит приложение по шагам.

1. Метод [getInstance](get-instance.md) создает объект. Конструктор регистрирует сервисы из глобальных настроек, подключает обработчик ошибок, читает параметры кеша из адреса, добавляет фоновую задачу обработки очередей сообщений, если очереди не обрабатываются из консоли, и создает пул соединений с базой данных.
2. Метод [initialize](initialize.md) создает контекст запроса, добавляет системные фоновые задачи и регистрирует сервисы модуля `main`.
3. Метод [start](start.md) завершает подготовку запроса.
4. Метод [end](end.md) отправляет ответ, а [terminate](terminate.md) выполняет фоновые задачи и завершает скрипт.

Подробнее — в статьях [Объект приложения и контекст](../../../framework/app-and-context.md) и [Фоновые задачи](../../../framework/background-jobs.md).

{% note warning "" %}

Методы `initializeBasicKernel`, `initializeExtendedKernel` и `isUtfMode` устарели. Метод `initializeBasicKernel` ничего не делает, `initializeExtendedKernel` вызывает [initializeContext](initialize-context.md), `isUtfMode` всегда возвращает `true`.

{% endnote %}

## Методы класса

### Объект и жизненный цикл

| Метод | Описание | С версии |
| --- | --- | --- |
| [getInstance](get-instance.md) | Возвращает объект приложения | |
| [hasInstance](has-instance.md) | Проверяет, создан ли объект приложения | |
| [initialize](initialize.md) | Подготавливает ядро к обработке запроса | |
| [isInitialized](is-initialized.md) | Проверяет, подготовлено ли ядро | |
| [initializeContext](initialize-context.md) | Создает контекст запроса | |
| [start](start.md) | Завершает подготовку запроса | |
| [run](run.md) | Выполняет контроллер и отправляет ответ | |
| [end](end.md) | Отправляет ответ и завершает приложение | |
| [terminate](terminate.md) | Выполняет фоновые задачи и завершает скрипт | |
| [addBackgroundJob](add-background-job.md) | Добавляет фоновую задачу | 20.5.0 |

### Контекст и маршрутизация

| Метод | Описание | С версии |
| --- | --- | --- |
| [getContext](get-context.md) | Возвращает контекст запроса | |
| [setContext](set-context.md) | Заменяет контекст запроса | |
| [getRouter](get-router.md) | Возвращает маршрутизатор | |
| [setRouter](set-router.md) | Заменяет маршрутизатор | |
| [getCurrentRoute](get-current-route.md) | Возвращает маршрут запроса | |
| [hasCurrentRoute](has-current-route.md) | Проверяет, задан ли маршрут запроса | |
| [setCurrentRoute](set-current-route.md) | Задает маршрут запроса | |

### База данных и кеш

| Метод | Описание | С версии |
| --- | --- | --- |
| [getConnection](get-connection.md) | Возвращает соединение с базой данных | 14.0.0 |
| [getConnectionPool](get-connection-pool.md) | Возвращает пул соединений | 14.0.0 |
| [getCache](get-cache.md) | Создает объект кеша | |
| [getManagedCache](get-managed-cache.md) | Возвращает управляемый кеш | |
| [getTaggedCache](get-tagged-cache.md) | Возвращает тегированный кеш | 14.0.18 |

### Сессии

| Метод | Описание | С версии |
| --- | --- | --- |
| [getSession](get-session.md) | Возвращает сессию | |
| [getKernelSession](get-kernel-session.md) | Возвращает сессию ядра | |
| [getCompositeSessionManager](get-composite-session-manager.md) | Возвращает менеджер обеих сессий | |
| [getSessionLocalStorageManager](get-session-local-storage-manager.md) | Возвращает менеджер локальных хранилищ сессии | |
| [getLocalSession](get-local-session.md) | Возвращает локальное хранилище сессии по имени | |

### Обработка ошибок

| Метод | Описание | С версии |
| --- | --- | --- |
| [getExceptionHandler](get-exception-handler.md) | Возвращает обработчик ошибок и исключений | |
| [createExceptionHandlerLog](create-exception-handler-log.md) | Создает журнал ошибок по настройкам | |
| [createExceptionHandlerOutput](create-exception-handler-output.md) | Создает вывод ошибок на экран | |

### Окружение

| Метод | Описание | С версии |
| --- | --- | --- |
| [getLicense](get-license.md) | Возвращает объект лицензии | |
| [getUserTypeManager](get-user-type-manager.md) | Возвращает менеджер пользовательских полей | |
| [getDocumentRoot](get-document-root.md) | Возвращает корневой каталог сайта | |
| [getPersonalRoot](get-personal-root.md) | Возвращает каталог `/bitrix` от корня сайта | |
| [resetAccelerator](reset-accelerator.md) | Сбрасывает кеш OPcache | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `JOB_PRIORITY_NORMAL` | `100` | Приоритет фоновой задачи по умолчанию для [addBackgroundJob](add-background-job.md) |
| `JOB_PRIORITY_LOW` | `50` | Низкий приоритет фоновой задачи. С ним ядро запускает агенты |

## Смотрите также

- [Объект приложения и контекст](../../../framework/app-and-context.md)
- [Context](../context/index.md)
- [Фоновые задачи](../../../framework/background-jobs.md)
