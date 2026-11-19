---
title: Добавить фоновую задачу Application::addBackgroundJob
description: Метод Application::addBackgroundJob добавляет фоновую задачу, которую ядро выполнит после отправки ответа клиенту.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 20.5.0

{% endnote %}

Метод `Application::addBackgroundJob` добавляет фоновую задачу. Ядро выполнит ее после отправки ответа клиенту, поэтому задача не замедляет ответ. Метод подходит для работы, результат которой клиент не ждет, например для отправки уведомлений или пересчета счетчиков.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function addBackgroundJob(callable $job, array $args = [], $priority = self::JOB_PRIORITY_NORMAL)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| job\* | `callable` | Задает функцию задачи |
| args | `array` | Задает аргументы функции. По умолчанию — пустой массив |
| priority | `int` | Задает приоритет. Ядро выполняет задачи с большим приоритетом раньше. По умолчанию — `Application::JOB_PRIORITY_NORMAL`, то есть `100` |

Тип `priority` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект приложения, поэтому вызовы можно объединять в цепочку.

## Особенности

- Задачи выполняет метод [terminate](terminate.md). Если скрипт завершился через `die` или `exit` и не вызвал `terminate`, ядро не выполнит задачи.
- Задача может добавить новые задачи. Ядро выполнит и их.
- Ошибку в задаче ядро пишет в журнал и выполняет остальные задачи. После всех задач ядро выбрасывает последнее исключение, и `terminate` не завершает работу штатно.
- Ядро не гарантирует порядок задач с одинаковым приоритетом.

## Примеры

**Пример.** Код добавляет задачу с аргументом и завершает приложение:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$application->addBackgroundJob(
    function (string $unit)
    {
        echo "job $unit";
    },
    ['kg']
);

echo "response\n";
$application->terminate();
```

Код выведет:

```text
response
job kg
```

## Смотрите также

- [Фоновые задачи](../../../framework/background-jobs.md)
- [Application::terminate](terminate.md)
