---
title: Получить контекст текущего запроса Context::getCurrent
description: Метод Context::getCurrent возвращает контекст текущего запроса или null, если приложение еще не создано.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getCurrent` возвращает контекст текущего запроса. Метод вызывает `Application::getInstance()->getContext()`.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public static function getCurrent()
```

## Возвращаемое значение

Метод возвращает объект контекста. В HTTP-запросе и в скрипте, который подключил `prolog_before.php`, это объект `Bitrix\Main\HttpContext`.

Если объект приложения еще не создан или приложение еще не создало контекст, метод возвращает `null`. Так бывает в коде, который выполняется до подключения ядра.

## Примеры

**Пример.** Код получает контекст и выводит идентификаторы сайта и языка:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$context = Context::getCurrent();

echo get_class($context) . ' ' . $context->getSite() . ' ' . $context->getLanguage();
```

На сайте `s1` с русским языком код выведет `Bitrix\Main\HttpContext s1 ru`.

## Смотрите также

- [Context::getRequest](get-request.md)
- [Приложение и контекст](../../../framework/app-and-context.md)
