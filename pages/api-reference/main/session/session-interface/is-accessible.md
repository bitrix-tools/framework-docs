---
title: Проверить, можно ли запустить сессию SessionInterface::isAccessible
description: Метод SessionInterface::isAccessible проверяет, можно ли еще запустить сессию — не отправлены ли заголовки ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::isAccessible` проверяет, можно ли запустить сессию. Метод нужен перед [start](start.md) в коде, который выполняется после начала вывода.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function isAccessible();
```

## Возвращаемое значение

Класс `Session` возвращает `false`, если сессия использует cookie и заголовки ответа уже отправлены. Иначе метод возвращает `true`. Класс `KernelSession` всегда возвращает `true`.

## Примеры

**Пример.** Код запускает сессию, только если это возможно:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();

if ($session->isAccessible())
{
    $session->start();
}

var_dump($session->isStarted());
```

Код выведет `bool(true)`.

## Смотрите также

- [SessionInterface::start](start.md)
