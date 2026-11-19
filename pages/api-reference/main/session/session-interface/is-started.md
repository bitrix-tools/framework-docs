---
title: Проверить, запущена ли сессия SessionInterface::isStarted
description: Метод SessionInterface::isStarted проверяет, запустил ли объект сессию и не закрыл ли ее.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::isStarted` проверяет, запущена ли сессия.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function isStarted();
```

## Возвращаемое значение

Метод возвращает `true`, если объект запустил сессию методом [start](start.md) и не закрыл ее методом [save](save.md). В классе `Session` метод [destroy](destroy.md) тоже закрывает сессию. Иначе метод возвращает `false`.

## Примеры

**Пример.** Код проверяет сессию после подключения пролога:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getInstance()->getSession()->isStarted());
```

Код выведет `bool(true)`.

## Смотрите также

- [SessionInterface::start](start.md)
