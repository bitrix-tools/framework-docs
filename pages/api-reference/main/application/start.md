---
title: Завершить подготовку запроса Application::start
description: Абстрактный метод Application::start завершает подготовку запроса после initialize. HttpApplication разбирает тело запроса в формате JSON.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Абстрактный метод `Application::start` завершает подготовку запроса. Пролог ядра вызывает метод после [initialize](initialize.md) и настройки языка и сайта. Вызывать метод в коде приложения не нужно.

`HttpApplication` в этом методе разбирает тело запроса в формате JSON. Если запрос пришел с заголовком `Content-Type: application/json` или с типом, который заканчивается на `+json`, метод `HttpRequest::getJsonList` возвращает данные из тела.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
abstract public function start();
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Если тело запроса — неверный JSON, метод не выбрасывает исключение. Список данных JSON останется пустым.

## Примеры

**Пример.** Код читает параметр, который клиент передал в теле запроса JSON:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$request = Application::getInstance()->getContext()->getRequest();

echo var_export($request->getJsonList()->get('unit'), true);
```

Если клиент отправил тело `{"unit":"kg"}` с заголовком `Content-Type: application/json`, код выведет `'kg'`. Из консоли код выведет `NULL`.

## Смотрите также

- [Application::initialize](initialize.md)
