---
title: Заменить контекст запроса Application::setContext
description: Метод Application::setContext заменяет контекст текущего запроса другим объектом Context.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::setContext` заменяет контекст текущего запроса. Метод [initializeContext](initialize-context.md) вызывает его сам. Код приложения вызывает метод в тестах, чтобы подменить запрос и вернуть прежний контекст после подмены.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function setContext(Context $context)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| context\* | `Bitrix\Main\Context` | Задает новый контекст |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

После замены `Context::getCurrent()` тоже возвращает новый контекст. Весь код до конца запроса работает с ним.

## Примеры

**Пример.** Код подменяет контекст и возвращает прежний:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$previous = $application->getContext();

$application->setContext(new Context($application));
echo get_class(Context::getCurrent()) . "\n";

$application->setContext($previous);
echo get_class(Context::getCurrent());
```

Код выведет:

```text
Bitrix\Main\Context
Bitrix\Main\HttpContext
```

## Смотрите также

- [Application::getContext](get-context.md)
