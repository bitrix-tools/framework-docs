---
title: Отправить ответ и завершить приложение Application::end
description: Метод Application::end отправляет ответ клиенту, затем выполняет фоновые задачи и завершает скрипт.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::end` отправляет ответ клиенту и завершает приложение методом [terminate](terminate.md). Используйте метод вместо `die` или `exit`. После ответа ядро выполнит фоновые задачи и закроет соединения с базой данных.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function end($status = 0, ?Response $response = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| status | `int` | Задает код завершения скрипта для `exit`. По умолчанию — `0`. Код ответа HTTP задает объект ответа |
| response | `Bitrix\Main\Response` или `null` | Задает ответ. По умолчанию — `null`, тогда метод берет ответ из контекста и добавляет в него содержимое буферов вывода |

Тип в таблице описывает назначение аргумента. Сигнатура PHP объявляет тип `response`.

## Возвращаемое значение

Метод завершает скрипт и не возвращает управление.

## Особенности

- Если код передал ответ, метод не добавляет в него содержимое буферов вывода.
- В режиме разделенной сессии метод перед отправкой сохраняет сессию ядра, если она запущена.

## Примеры

**Пример.** Код отправляет ответ JSON, а фоновая задача выполняется после него:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Engine\Response\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$application->addBackgroundJob(
    function ()
    {
        echo "\njob";
    }
);

$application->end(0, new Json(['unit' => 'kg']));

echo 'never';
```

Код выведет:

```text
{"unit":"kg"}
job
```

## Смотрите также

- [Application::terminate](terminate.md)
- [HttpResponse](../http-response/index.md)
