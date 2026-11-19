---
title: Получить приложение Context::getApplication
description: Метод Context::getApplication возвращает объект приложения, которому принадлежит контекст.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getApplication` возвращает приложение, которое создало контекст. Для контекста текущего запроса это тот же объект, что возвращает `Application::getInstance()`.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getApplication()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Application`. В HTTP-запросе это `Bitrix\Main\HttpApplication`.

## Примеры

**Пример.** Код проверяет, что контекст принадлежит текущему приложению:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Context::getCurrent()->getApplication();

var_dump($application === Application::getInstance());
```

Код выведет `bool(true)`.

## Смотрите также

- [Context::getCurrent](get-current.md)
- [Приложение и контекст](../../../framework/app-and-context.md)
