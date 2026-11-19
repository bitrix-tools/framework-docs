---
title: ServiceLocator — реестр сервисов
description: Класс Bitrix\Main\DI\ServiceLocator регистрирует сервисы и создает их объекты с автоматической подстановкой зависимостей.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DI`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 20.5.0

{% endnote %}

## Когда использовать

Класс `ServiceLocator` хранит сервисы приложения и создает их объекты по требованию. Сервисы регистрируют в секции `services` файла `.settings.php` сайта или модуля либо из кода. Класс реализует интерфейс `Psr\Container\ContainerInterface`.

Метод [getInstance](get-instance.md) возвращает единственный на процесс объект класса. Конструктор закрытый.

Ядро регистрирует сервисы из `.settings.php` сайта и сервисы модуля `main` при запуске приложения. Сервисы другого модуля ядро регистрирует при первом успешном подключении модуля через `Loader::includeModule`.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getInstance](get-instance.md) | Возвращает единственный объект класса | |
| [get](get.md) | Возвращает объект сервиса и при необходимости создает его | |
| [has](has.md) | Проверяет, зарегистрирован ли сервис | |
| [addInstance](add-instance.md) | Регистрирует готовый объект сервиса | |
| [addInstanceLazy](add-instance-lazy.md) | Регистрирует сервис и создает его объект при первом вызове `get` | |
| [registerByModuleSettings](register-by-module-settings.md) | Регистрирует сервисы из `.settings.php` модуля | |
| [registerByGlobalSettings](register-by-global-settings.md) | Регистрирует сервисы из `.settings.php` сайта | |

## Исключения класса

| Исключение | Родитель | Интерфейс PSR |
| --- | --- | --- |
| `Bitrix\Main\DI\Exception\ServiceNotFoundException` | `Bitrix\Main\ObjectNotFoundException` | `NotFoundExceptionInterface` |
| `Bitrix\Main\DI\Exception\CircularDependencyException` | `Bitrix\Main\SystemException` | `ContainerExceptionInterface` |
| `Bitrix\Main\DI\Exception\RegistrationException` | `Bitrix\Main\SystemException` | `ContainerExceptionInterface` |

## Смотрите также

- [Сервис-локатор](../../../../framework/service-locator.md)
