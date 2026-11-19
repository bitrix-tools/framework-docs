---
title: Создать журнал ошибок Application::createExceptionHandlerLog
description: Метод Application::createExceptionHandlerLog создает журнал ошибок по ключу log секции exception_handling файла .settings.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::createExceptionHandlerLog` создает журнал ошибок по ключу `log` секции `exception_handling` файла `.settings.php`. Обработчик ошибок вызывает метод сам при первой записи в журнал. Вызывать метод в коде приложения не нужно.

```php
'exception_handling' => [
    'value' => [
        'debug' => false,
        'log' => [
            'settings' => [
                'file' => 'local/logs/php_errors.log',
                'log_size' => 1000000,
            ],
        ],
    ],
    'readonly' => false,
],
```

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function createExceptionHandlerLog()
```

## Возвращаемое значение

Метод возвращает объект наследника `Bitrix\Main\Diag\ExceptionHandlerLog` или `null`.

| Настройки ключа `log` | Результат |
| --- | --- |
| Задан `class_name` | Объект этого класса. Ключ `required_file` задает файл с классом, ключ `extension` — нужное расширение PHP |
| Задан только `settings` | Объект `Bitrix\Main\Diag\FileExceptionHandlerLog`, который пишет в файл |
| Ключа нет, класс не найден или расширение не загружено | `null` |

## Особенности

Метод передает журналу массив `settings` методом `initialize`.

## Примеры

**Пример.** Код проверяет, настроен ли журнал ошибок:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$log = Application::getInstance()->createExceptionHandlerLog();

echo $log ? get_class($log) : 'no log';
```

Код выведет `Bitrix\Main\Diag\FileExceptionHandlerLog`, если в настройках задан файл журнала. Без ключа `log` код выведет `no log`.

## Смотрите также

- [Application::getExceptionHandler](get-exception-handler.md)
- [Как найти причину ошибки](../../../framework/script-error.md)
