---
title: Завершить приложение Application::terminate
description: Метод Application::terminate закрывает сессию, выполняет фоновые задачи, отключается от базы данных и завершает скрипт.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::terminate` завершает приложение без отправки ответа. Метод [end](end.md) вызывает его сам после отправки ответа. Код приложения вызывает метод, когда уже отправил ответ сам.

Метод выполняет шаги по порядку.

1. Выполняет завершающие действия старого ядра, например обработчики события `OnAfterEpilog`.
2. Закрывает сессию PHP.
3. Выполняет фоновые задачи из [addBackgroundJob](add-background-job.md). Запросы к базе данных в задачах идут только к основному серверу.
4. Сохраняет управляемый кеш, отключается от базы данных и вызывает `exit`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function terminate($status = 0)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| status | `int` | Задает код завершения скрипта для `exit`. По умолчанию — `0` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод завершает скрипт и не возвращает управление.

## Особенности

- Повторный вызов во время завершения ничего не делает. Так фоновая задача может вызвать `end` или `terminate` без зацикливания.
- Если фоновая задача выбросила исключение, метод пишет его в журнал и выполняет остальные задачи. После всех задач метод выбрасывает последнее исключение. Шаг 4 тогда не выполняется: управляемый кеш не сохранится, а исключение получит глобальный обработчик ошибок.

## Примеры

**Пример.** Код добавляет две фоновые задачи с разным приоритетом и завершает приложение:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$application
    ->addBackgroundJob(
        function ()
        {
            echo "low\n";
        },
        [],
        Application::JOB_PRIORITY_LOW
    )
    ->addBackgroundJob(
        function ($unit)
        {
            echo "normal $unit\n";
        },
        ['kg']
    )
;

echo "response\n";
$application->terminate();

echo 'never';
```

Код выведет:

```text
response
normal kg
low
```

## Смотрите также

- [Application::end](end.md)
- [Application::addBackgroundJob](add-background-job.md)
