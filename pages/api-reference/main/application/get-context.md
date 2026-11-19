---
title: Получить контекст запроса Application::getContext
description: Метод Application::getContext возвращает контекст текущего запроса — запрос, ответ, сервер, сайт и язык.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getContext` возвращает [контекст](../context/index.md) текущего запроса. Через контекст код получает запрос, ответ, данные сервера, сайт и язык.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getContext()
```

## Возвращаемое значение

Метод возвращает объект [Context](../context/index.md). У `HttpApplication` это наследник `Bitrix\Main\HttpContext`. До [initializeContext](initialize-context.md) метод возвращает `null`.

## Особенности

Метод `Context::getCurrent()` возвращает тот же объект.

## Примеры

**Пример.** Код читает класс контекста и сайт:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$context = Application::getInstance()->getContext();

echo get_class($context) . ' ' . get_class($context->getRequest());
```

Код выведет `Bitrix\Main\HttpContext Bitrix\Main\HttpRequest`.

## Смотрите также

- [Context](../context/index.md)
- [Application::setContext](set-context.md)
