---
title: Уничтожить сессию SessionInterface::destroy
description: Метод SessionInterface::destroy уничтожает данные сессии в хранилище и закрывает сессию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::destroy` уничтожает сессию. Метод нужен, например, при выходе пользователя, когда данные сессии больше не нужны.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function destroy();
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Класс `Session` вызывает функцию PHP `session_destroy`, если сессия активна, и помечает сессию незапущенной. Метод не очищает значения в объекте сессии.
- Класс `KernelSession` очищает данные методом [clear](clear.md), сессия остается запущенной.

## Примеры

**Пример.** Код уничтожает сессию и проверяет состояние:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->destroy();

var_dump($session->isStarted());
```

Код выведет `bool(false)`.

## Смотрите также

- [SessionInterface::clear](clear.md)
- [SessionInterface::save](save.md)
