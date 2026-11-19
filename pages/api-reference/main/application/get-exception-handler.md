---
title: Получить обработчик ошибок Application::getExceptionHandler
description: Метод Application::getExceptionHandler возвращает обработчик ошибок и исключений ядра. Через него код пишет исключение в журнал.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getExceptionHandler` возвращает обработчик ошибок и исключений ядра. Конструктор приложения создает обработчик по секции `exception_handling` файла `.settings.php` и регистрирует его в [ServiceLocator](../di/service-locator/index.md) под именем `exceptionHandler`. Метод нужен, чтобы записать в журнал исключение, которое код перехватил сам.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getExceptionHandler()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Diag\ExceptionHandler`.

## Особенности

Метод `writeToLog` пишет исключение в журнал, только если в секции `exception_handling` настроен ключ `log`. Без журнала метод ничего не делает.

## Примеры

**Пример.** Код перехватывает исключение и пишет его в журнал:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    throw new \RuntimeException('Unit not found');
}
catch (\RuntimeException $exception)
{
    Application::getInstance()->getExceptionHandler()->writeToLog($exception);
    echo 'logged';
}
```

Код выведет `logged`. Если журнал настроен, в нем появится запись об исключении.

## Смотрите также

- [Application::createExceptionHandlerLog](create-exception-handler-log.md)
- [Как найти причину ошибки](../../../framework/script-error.md)
