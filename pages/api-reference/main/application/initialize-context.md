---
title: Создать контекст запроса Application::initializeContext
description: Абстрактный метод Application::initializeContext создает контекст запроса из переданных данных. HttpApplication создает HttpContext с запросом, ответом и данными сервера.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Абстрактный метод `Application::initializeContext` создает контекст запроса и сохраняет его методом [setContext](set-context.md). Наследник реализует метод под свой тип приложения. `HttpApplication` создает объект `HttpContext` с запросом `HttpRequest`, ответом `HttpResponse` и данными сервера.

Метод [initialize](initialize.md) вызывает его сам. Еще его вызывает файл `/bitrix/modules/main/include/routing_index.php`, который обрабатывает запросы по маршрутам.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
abstract public function initializeContext(array $params);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| params\* | `array` | Задает данные запроса. Для `HttpApplication` — массив с ключами `get`, `post`, `files`, `cookie`, `server`, `env` |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод заменяет текущий контекст новым. Запрос, ответ и сайт прежнего контекста теряются.
- В версии `main` 26.150.0 метод защищенный. Вызвать его снаружи нельзя, контекст создает устаревший метод `initializeExtendedKernel`.

## Примеры

**Пример.** Код создает контекст из своих данных и читает параметр запроса:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();

if (is_callable([$application, 'initializeContext']))
{
    $application->initializeContext([
        'get' => ['unit' => 'kg'],
        'post' => [],
        'files' => [],
        'cookie' => [],
        'server' => $_SERVER,
        'env' => [],
    ]);
    echo $application->getContext()->getRequest()->get('unit');
}
else
{
    echo 'not available';
}
```

В версии с публичным методом код выведет `kg`. В версии `main` 26.150.0 код выведет `not available`.

## Смотрите также

- [Application::getContext](get-context.md)
- [Context](../context/index.md)
