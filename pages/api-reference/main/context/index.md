---
title: Context — контекст запроса
description: Класс Bitrix\Main\Context хранит запрос, ответ, сервер, сайт, язык и региональные настройки текущего запроса.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Context` хранит запрос, ответ, сервер, сайт, язык и региональные настройки текущего запроса. Метод [getCurrent](get-current.md) возвращает контекст текущего запроса. Вызов `Application::getInstance()->getContext()` возвращает тот же объект. Для текущего запроса создавать объект конструктором не нужно.

Ядро заполняет контекст в начале запроса, когда подключает `prolog_before.php`:

- метод [initialize](initialize.md) задает запрос, ответ, сервер и переменные окружения,
- метод `HttpContext::initializeCulture` задает язык и региональные настройки, а в публичной части еще и сайт.

В публичной части ядро определяет сайт по домену и пути страницы. Если до подключения ядра задана константа `SITE_ID` или `LANG`, ядро берет сайт из нее. Константы `SITE_ID` и `LANGUAGE_ID`, которые не задали заранее, ядро задает из контекста. Эти константы и глобальный объект `$APPLICATION` — аналоги контекста в классическом API.

Подробнее — в разделе «Контекст» статьи [Приложение и контекст](../../../framework/app-and-context.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getCurrent](get-current.md) | Возвращает контекст текущего запроса | |
| [getRequest](get-request.md) | Возвращает запрос | |
| [getResponse](get-response.md) | Возвращает ответ | |
| [setResponse](set-response.md) | Заменяет ответ | |
| [getServer](get-server.md) | Возвращает данные сервера | |
| [getEnvironment](get-environment.md) | Возвращает переменные окружения | |
| [getApplication](get-application.md) | Возвращает приложение | |
| [getSite](get-site.md) | Возвращает идентификатор сайта | 14.0.0 |
| [getSiteObject](get-site-object.md) | Возвращает объект сайта | |
| [setSite](set-site.md) | Задает сайт | 14.0.0 |
| [getLanguage](get-language.md) | Возвращает идентификатор языка | |
| [getLanguageObject](get-language-object.md) | Возвращает объект языка | |
| [setLanguage](set-language.md) | Задает язык | |
| [getCulture](get-culture.md) | Возвращает региональные настройки | |
| [setCulture](set-culture.md) | Задает региональные настройки | |
| [initialize](initialize.md) | Задает запрос, ответ, сервер и переменные окружения | |

## Наследование

### Реализации

| Класс | Собственные методы |
| --- | --- |
| `Bitrix\Main\HttpContext` | Методы выбора сайта и языка и смены адреса запроса — `initializeCulture`, `rewriteUri`, `transferUri` |

В HTTP-запросе метод [getCurrent](get-current.md) возвращает объект `HttpContext`.

## Смотрите также

- [Приложение и контекст](../../../framework/app-and-context.md)
- [Запрос и ответ](../../../framework/request-response.md)
- [HttpResponse](../http-response/index.md)
