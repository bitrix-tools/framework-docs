---
title: Получить обработчик хранения SessionInterface::getSessionHandler
description: Метод SessionInterface::getSessionHandler возвращает обработчик, который читает и записывает данные сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::getSessionHandler` возвращает обработчик хранения сессии. Обработчик читает и записывает данные в файлы, Redis, Memcache или базу данных. Секция `session` файла `.settings.php` задает тип обработчика.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function getSessionHandler(): ?\SessionHandlerInterface;
```

## Возвращаемое значение

Метод возвращает объект `\SessionHandlerInterface` или `null`, если обработчик не задан.

Класс `Session` возвращает обработчик из настроек.

- хранение в файлах — `StrictSessionHandler`, он работает поверх `NativeFileSessionHandler`,
- база данных — `DatabaseSessionHandler`,
- Redis — `RedisSessionHandler`,
- Memcache — `MemcacheSessionHandler`,
- типы `array` и `null` — `NullSessionHandler`.

Классы обработчиков находятся в пространстве имен `Bitrix\Main\Session\Handlers`. Метод возвращает `null`, если в `php.ini` параметр `session.save_handler` отличается от `files`, а в `.settings.php` нет секции `session` или в ней задан только режим `default`. Тогда сессией управляет собственный обработчик PHP.

Класс `KernelSession` возвращает обработчик `CookieSessionHandler` после запуска сессии. До запуска метод выбрасывает `\TypeError`.

## Примеры

**Пример.** Код выводит класс обработчика:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$handler = Application::getInstance()->getSession()->getSessionHandler();

echo $handler ? get_class($handler) : 'no handler';
```

Класс зависит от настроек сайта. При хранении сессий в файлах код выведет `Bitrix\Main\Session\Handlers\StrictSessionHandler`.

## Смотрите также

- [Сессии](../../../../framework/sessions.md)
