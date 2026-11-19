---
title: SessionInterface — интерфейс сессии
description: Интерфейс Bitrix\Main\Session\SessionInterface описывает сессию пользователя — запуск, сохранение, идентификатор и чтение и запись значений по ключу.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Session`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 20.5.0

{% endnote %}

## Когда использовать

Интерфейс `SessionInterface` описывает сессию пользователя. Метод `Application::getInstance()->getSession()` возвращает объект сессии, через который код читает и записывает значения вместо массива `$_SESSION`.

Интерфейс содержит три основные группы методов.

- [get](get.md), [set](set.md), [has](has.md) и [remove](remove.md) работают со значениями по ключу.
- [start](start.md) и [save](save.md) запускают и сохраняют сессию.
- [getId](get-id.md) и [regenerateId](regenerate-id.md) работают с идентификатором сессии.

Объекты сессии реализуют и интерфейс `\ArrayAccess`, поэтому значение можно прочитать как `$session['key']`.

Подробнее — в статье [Сессии](../../../../framework/sessions.md).

## Методы интерфейса

| Метод | Описание | С версии |
| --- | --- | --- |
| [get](get.md) | Возвращает значение по ключу | |
| [set](set.md) | Записывает значение по ключу | |
| [has](has.md) | Проверяет, есть ли ключ | |
| [remove](remove.md) | Удаляет значение по ключу | |
| [clear](clear.md) | Удаляет все значения | |
| [start](start.md) | Запускает сессию | |
| [isStarted](is-started.md) | Проверяет, запущена ли сессия | |
| [isAccessible](is-accessible.md) | Проверяет, можно ли запустить сессию | |
| [save](save.md) | Сохраняет данные и закрывает сессию | |
| [destroy](destroy.md) | Уничтожает сессию | |
| [getId](get-id.md) | Возвращает идентификатор сессии | |
| [setId](set-id.md) | Задает идентификатор сессии до запуска | |
| [regenerateId](regenerate-id.md) | Меняет идентификатор сессии с сохранением данных | |
| [getName](get-name.md) | Возвращает имя cookie сессии | |
| [setName](set-name.md) | Задает имя cookie сессии до запуска | |
| [getSessionHandler](get-session-handler.md) | Возвращает обработчик хранения сессии | |

## Реализации

| Класс | Назначение |
| --- | --- |
| `Bitrix\Main\Session\Session` | Сессия PHP. Хранит данные в `$_SESSION` через обработчик из `.settings.php`, например файлы, Redis или базу данных. Объект возвращает `Application::getSession` |
| `Bitrix\Main\Session\KernelSession` | Сессия ядра в разделенном режиме. Хранит данные в зашифрованной cookie. Методы `setId`, `getName` и `setName` выбрасывают `NotSupportedException`, `regenerateId` ничего не делает |
| `Bitrix\Main\Session\KernelSessionProxy` | Сессия ядра в обычном режиме. Передает вызовы объекту `Session` |

Метод `Application::getKernelSession` возвращает объект сессии ядра. В обычном режиме это `KernelSessionProxy`, в разделенном — `KernelSession`. Секция `session` файла `.settings.php` задает режим. В разделенном режиме ядро запускает сессию `Session` лениво, при первом обращении к данным.

## Смотрите также

- [Сессии](../../../../framework/sessions.md)
- [SessionLocalStorage](../../data/local-storage/session-local-storage/index.md)
