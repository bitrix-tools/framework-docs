---
title: Создать вывод ошибок Application::createExceptionHandlerOutput
description: Метод Application::createExceptionHandlerOutput создает объект, который выводит необработанное исключение на экран.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::createExceptionHandlerOutput` создает объект, который выводит необработанное исключение на экран. Обработчик ошибок вызывает метод сам при первом исключении. Вызывать метод в коде приложения не нужно.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function createExceptionHandlerOutput()
```

## Возвращаемое значение

Метод возвращает объект с интерфейсом `Bitrix\Main\Diag\IExceptionHandlerOutput`. Класс зависит от приложения.

| Приложение | Класс | Вывод |
| --- | --- | --- |
| `Application` | `Bitrix\Main\Diag\ExceptionHandlerOutput` | Текст исключения |
| `HttpApplication` | `Bitrix\Main\Diag\HttpExceptionHandlerOutput` | Ответ с кодом 500. В режиме отладки — текст исключения, иначе — страница `/error.php` или общее сообщение об ошибке |

## Примеры

**Пример.** Код выводит класс вывода ошибок:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo get_class(Application::getInstance()->createExceptionHandlerOutput());
```

Код выведет `Bitrix\Main\Diag\HttpExceptionHandlerOutput`.

## Смотрите также

- [Application::getExceptionHandler](get-exception-handler.md)
- [Как найти причину ошибки](../../../framework/script-error.md)
