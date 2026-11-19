---
title: Router — маршрутизатор приложения
description: Класс Bitrix\Main\Routing\Router хранит маршруты из файлов маршрутов, находит маршрут для запроса и строит URL по имени маршрута.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Routing`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `Router` хранит маршруты приложения. Метод `Application::getInstance()->getRouter()` возвращает готовый объект. Класс `ServiceLocator` возвращает тот же объект по имени класса `Router`.

При первом вызове `getRouter` приложение создает объект и подключает файлы маршрутов:

- файлы из секции `routing` конфигурации ядра — по имени файла из каталогов `/local/routes/` и `/bitrix/routes/`,
- системные файлы из секции `routing` файла `/bitrix/routes/.settings.php`.

Затем приложение вызывает [releaseRoutes](release-routes.md). Метод [route](route.md) строит URL по имени маршрута, метод [match](match.md) находит маршрут для запроса.

Подробнее о маршрутах — в статье [Роутинг](../../../../framework/routing.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [route](route.md) | Строит URL по имени маршрута и значениям параметров | |
| [url](url.md) | Добавляет к URL строку запроса из массива параметров | |
| [match](match.md) | Находит маршрут, который подходит запросу | |
| [getRoutes](get-routes.md) | Возвращает список маршрутов | |
| [registerConfiguration](register-configuration.md) | Добавляет настройку, из которой `releaseRoutes` создает маршрут | |
| [releaseRoutes](release-routes.md) | Переносит маршруты из добавленных настроек в список маршрутов | |

## Смотрите также

- [Роутинг](../../../../framework/routing.md)
- [Контроллеры](../../../../framework/controllers.md)
