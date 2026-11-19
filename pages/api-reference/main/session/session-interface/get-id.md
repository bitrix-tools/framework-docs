---
title: Получить идентификатор сессии SessionInterface::getId
description: Метод SessionInterface::getId возвращает идентификатор текущей сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::getId` возвращает идентификатор сессии.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function getId();
```

## Возвращаемое значение

Класс `Session` возвращает результат функции PHP `session_id`. Если сессия не запущена и идентификатор не задан, это пустая строка.

Класс `KernelSession` возвращает идентификатор сессии ядра после запуска сессии. Сессия ядра хранит его в cookie вместе с данными. До запуска метод выбрасывает `\TypeError`.

## Примеры

**Пример.** Код проверяет, что у сессии есть идентификатор:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$id = Application::getInstance()->getSession()->getId();

echo ($id !== '' ? 'has id' : 'no id');
```

Код выведет `has id`.

## Смотрите также

- [SessionInterface::setId](set-id.md)
- [SessionInterface::regenerateId](regenerate-id.md)
