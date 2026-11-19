---
title: Получить объект приложения Application::getInstance
description: Статический метод Application::getInstance возвращает единственный объект приложения и создает его при первом вызове.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Application::getInstance` возвращает объект приложения. Объект один на весь запрос. Первый вызов создает его, следующие вызовы возвращают тот же объект.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public static function getInstance()
```

## Возвращаемое значение

Метод возвращает объект наследника `Application`. После подключения пролога это `Bitrix\Main\HttpApplication`.

## Особенности

- Пролог ядра создает объект вызовом `HttpApplication::getInstance()`. Поэтому `Application::getInstance()` в коде приложения возвращает объект `HttpApplication`.
- Если объект еще не создан, метод создает объект того класса, у которого его вызвали. До пролога вызов у абстрактного `Application` приводит к ошибке PHP.

## Примеры

**Пример.** Код получает объект приложения и проверяет, что он один:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();

echo get_class($application) . ' ' . var_export($application === Application::getInstance(), true);
```

Код выведет `Bitrix\Main\HttpApplication true`.

## Смотрите также

- [Application::hasInstance](has-instance.md)
- [Объект приложения и контекст](../../../framework/app-and-context.md)
