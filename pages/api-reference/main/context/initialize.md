---
title: Задать запрос, ответ, сервер и окружение Context::initialize
description: Метод Context::initialize задает контексту запрос, ответ, сервер и параметры с переменными окружения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::initialize` задает контексту запрос, ответ, сервер и параметры. Ядро вызывает метод в начале запроса. В своем коде метод нужен, например, чтобы собрать контекст для теста.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function initialize(Request $request, Response $response, Server $server, array $params = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Bitrix\Main\Request` | Задает запрос |
| response\* | `Bitrix\Main\Response` | Задает ответ |
| server\* | `Bitrix\Main\Server` | Задает данные сервера |
| params | `array` | Задает параметры. Ключ `env` — массив переменных окружения для [getEnvironment](get-environment.md). По умолчанию — пустой массив |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод не задает сайт, язык и региональные настройки. Их задают методы [setSite](set-site.md), [setLanguage](set-language.md) и [setCulture](set-culture.md).

## Примеры

**Пример.** Код собирает контекст для теста с запросом к `/units/` и своими переменными окружения:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Context;
use Bitrix\Main\HttpRequest;
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Server;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$server = new Server(['REQUEST_URI' => '/units/', 'REQUEST_METHOD' => 'GET']);

$context = new Context(Application::getInstance());
$context->initialize(
    new HttpRequest($server, [], [], [], []),
    new HttpResponse(),
    $server,
    ['env' => ['APP_MODE' => 'test']]
);

echo $context->getRequest()->getRequestUri() . ' ' . $context->getEnvironment()->get('APP_MODE');
```

Код выведет `/units/ test`.

## Смотрите также

- [Context::getRequest](get-request.md)
- [Context::getEnvironment](get-environment.md)
