---
title: Запустить сессию SessionInterface::start
description: Метод SessionInterface::start запускает сессию. Если сессия уже запущена, метод возвращает true.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::start` запускает сессию. В обычном режиме ядро запускает сессию при подключении пролога. В разделенном режиме ядро запускает ее при первом обращении к данным. Вызывайте метод, если сессию закрыли методом [save](save.md) и ее нужно открыть снова.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function start();
```

## Возвращаемое значение

Метод возвращает `true`, в том числе если сессия уже запущена.

## Исключения

Класс `Session` выбрасывает исключения в таких случаях.

| Исключение | Когда возникает |
| --- | --- |
| `\RuntimeException` | Сессия PHP уже активна, но объект ее не запускал, или заголовки ответа уже отправлены, или функция `session_start` не смогла запустить сессию |
| `\Error` или исключение, которое его вызвало | Обработчик сессии выбросил ошибку внутри `session_start`. Если у ошибки есть предыдущее исключение, метод выбрасывает его |

Если в секции `session` файла `.settings.php` задан ключ `ignoreSessionStartErrors` со значением `true`, ошибка `session_start` не выбрасывает исключение. Метод возвращает `true`.

## Примеры

**Пример.** Код закрывает сессию и запускает ее снова:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->save();
$before = $session->isStarted();
$session->start();

var_export([$before, $session->isStarted()]);
```

Код выведет:

```text
array (
  0 => false,
  1 => true,
)
```

## Смотрите также

- [SessionInterface::save](save.md)
- [SessionInterface::isAccessible](is-accessible.md)
