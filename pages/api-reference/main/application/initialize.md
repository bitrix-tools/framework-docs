---
title: Подготовить ядро Application::initialize
description: Метод Application::initialize один раз подготавливает ядро к обработке запроса — создает контекст, добавляет системные фоновые задачи и регистрирует сервисы модуля main.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::initialize` подготавливает ядро к обработке запроса. Пролог ядра вызывает метод сам сразу после [getInstance](get-instance.md). Вызывать метод в коде приложения не нужно.

Метод появился в версии `main` новее 26.150.0. В более ранних версиях ту же работу выполняет устаревший метод `initializeExtendedKernel`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function initialize(array $params): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| params\* | `array` | Задает данные запроса для [initializeContext](initialize-context.md). Для `HttpApplication` — ключи `get`, `post`, `files`, `cookie`, `server`, `env` |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод выполняется один раз. Повторный вызов ничего не делает.
- Метод вызывает [initializeContext](initialize-context.md), добавляет системные фоновые задачи и регистрирует сервисы модуля `main` из его `.settings.php`.
- Системные фоновые задачи — агенты, почтовые события, счетчики пользователей, а на сайтах без модуля `bitrix24` — обновление правил веб-защиты и уведомлений о безопасности. Метод добавляет агенты и почтовые события, только если в настройках главного модуля включен их запуск на хитах. Константа `BX_SENDPULL_COUNTER_QUEUE_DISABLE` со значением `true` отключает задачу счетчиков.
- После вызова [isInitialized](is-initialized.md) возвращает `true`.

## Примеры

**Пример.** Код повторно вызывает метод после пролога:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();

if (method_exists($application, 'initialize'))
{
    $context = $application->getContext();
    $application->initialize(['get' => [], 'post' => [], 'files' => [], 'cookie' => [], 'server' => [], 'env' => []]);
    var_dump($application->getContext() === $context);
}
else
{
    echo 'not available';
}
```

В версии с методом код выведет `bool(true)`. Пролог уже подготовил ядро, и повторный вызов не меняет контекст. В версии `main` 26.150.0 код выведет `not available`.

## Смотрите также

- [Application::isInitialized](is-initialized.md)
- [Application::initializeContext](initialize-context.md)
