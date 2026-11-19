---
title: Получить сессию Application::getSession
description: Метод Application::getSession возвращает общую сессию пользователя. Через нее код читает и записывает данные сессии вместо $_SESSION.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getSession` возвращает общую сессию пользователя. Через объект код читает и записывает данные сессии вместо массива `$_SESSION`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
final public function getSession(): SessionInterface
```

## Возвращаемое значение

Метод возвращает объект с интерфейсом [SessionInterface](../session/session-interface/index.md), например `Bitrix\Main\Session\Session`.

## Особенности

- Секция `session` файла `.settings.php` задает тип сессии. В режиме разделенной сессии ядро хранит часть данных в отдельной сессии ядра — ее возвращает [getKernelSession](get-kernel-session.md).
- Метод не запускает сессию. Если сессия не разделена, пролог запускает ее сам. В режиме разделенной сессии общая сессия запускается при первом обращении к данным.

## Примеры

**Пример.** Код записывает значение в сессию и читает его:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('vendor_unit', 'kg');

echo $session->get('vendor_unit');
$session->remove('vendor_unit');
```

Код выведет `kg`.

## Смотрите также

- [SessionInterface](../session/session-interface/index.md)
- [Сессии](../../../framework/sessions.md)
