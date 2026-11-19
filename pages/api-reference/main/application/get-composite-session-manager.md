---
title: Получить менеджер сессий Application::getCompositeSessionManager
description: Метод Application::getCompositeSessionManager возвращает менеджер, который запускает, очищает и удаляет сессию ядра и общую сессию вместе.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getCompositeSessionManager` возвращает менеджер обеих сессий — сессии ядра и общей сессии. Менеджер запускает, очищает, удаляет сессии и меняет их идентификатор одним вызовом. Метод нужен, например, при выходе пользователя, чтобы удалить данные из обеих сессий.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
final public function getCompositeSessionManager(): CompositeSessionManager
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Session\CompositeSessionManager`. У объекта четыре метода.

| Метод | Действие |
| --- | --- |
| `start()` | Запускает сессии, которые еще не запущены |
| `clear()` | Удаляет данные сессий |
| `destroy()` | Удаляет сессии |
| `regenerateId()` | Меняет идентификатор сессий и отправляет событие `onRegenerateSessionId` модуля `main` |

## Особенности

Если сессия не разделена, менеджер работает только с общей сессией. Сессия ядра в этом режиме хранит данные в ней же.

## Примеры

**Пример.** Код запускает сессии и меняет их идентификатор:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$before = $application->getSession()->getId();

$application->getCompositeSessionManager()->regenerateId();

var_dump($application->getSession()->getId() !== $before);
```

Код выведет `bool(true)`.

## Смотрите также

- [Application::getSession](get-session.md)
- [Application::getKernelSession](get-kernel-session.md)
