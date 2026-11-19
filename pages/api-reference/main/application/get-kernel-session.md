---
title: Получить сессию ядра Application::getKernelSession
description: Метод Application::getKernelSession возвращает сессию ядра — в ней ядро хранит авторизацию и служебные данные.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getKernelSession` возвращает сессию ядра. В ней ядро хранит авторизацию пользователя и служебные данные. Данные приложения храните в сессии из [getSession](get-session.md).

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
final public function getKernelSession(): SessionInterface
```

## Возвращаемое значение

Метод возвращает объект с интерфейсом [SessionInterface](../session/session-interface/index.md). Класс зависит от режима сессии в секции `session` файла `.settings.php`.

| Режим | Класс | Где ядро хранит данные |
| --- | --- | --- |
| `default` | `Bitrix\Main\Session\KernelSessionProxy` | В общей сессии из [getSession](get-session.md) |
| `separated` | `Bitrix\Main\Session\KernelSession` | В зашифрованных cookies |

## Примеры

**Пример.** Код определяет режим сессии по классу сессии ядра:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Session\KernelSessionProxy;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$kernelSession = Application::getInstance()->getKernelSession();

echo $kernelSession instanceof KernelSessionProxy ? 'default' : 'separated';
```

Код выведет `default`, если сессия не разделена.

## Смотрите также

- [Application::getSession](get-session.md)
- [Горячая и холодная сессия](../../../performance/hot-and-cold-session.md)
