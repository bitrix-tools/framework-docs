---
title: Сохранить данные и закрыть сессию SessionInterface::save
description: Метод SessionInterface::save сохраняет данные сессии и закрывает ее, чтобы освободить блокировку.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::save` сохраняет данные сессии и закрывает ее. Метод нужен перед долгой операцией, например запросом к внешнему сервису. Тогда другие запросы пользователя не ждут, пока сессия освободится.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function save();
```

## Возвращаемое значение

Метод ничего не возвращает. После вызова [isStarted](is-started.md) возвращает `false`. Чтобы снова записать данные, запустите сессию методом [start](start.md). В разделенном режиме методы `get` и `set` запустят сессию сами.

## Особенности

- Класс `Session` вызывает функцию PHP `session_write_close`. Перед этим метод удаляет ключи со значением `null`, которые создал [get](get.md) при чтении.
- Класс `KernelSession` записывает данные в cookie, только если они изменились.

## Примеры

**Пример.** Код записывает значение, закрывает сессию и проверяет состояние:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('units_view', 'list');
$session->save();

var_dump($session->isStarted());
```

Код выведет `bool(false)`.

## Смотрите также

- [SessionInterface::start](start.md)
