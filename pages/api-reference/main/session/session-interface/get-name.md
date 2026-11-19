---
title: Получить имя cookie сессии SessionInterface::getName
description: Метод SessionInterface::getName возвращает имя cookie, в которой браузер передает идентификатор сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::getName` возвращает имя сессии. Под этим именем браузер передает идентификатор сессии в cookie.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function getName();
```

## Возвращаемое значение

Класс `Session` возвращает результат функции PHP `session_name`. Имя задает параметр `session.name` в `php.ini`. В окружении «1С-Битрикс: Веб-окружение» это `BITRIX_PHPSESSID`, по умолчанию в PHP — `PHPSESSID`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotSupportedException` | Класс `KernelSession` не поддерживает метод |

## Примеры

**Пример.** Код выводит имя сессии:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getInstance()->getSession()->getName();
```

В окружении «1С-Битрикс: Веб-окружение» код выведет `BITRIX_PHPSESSID`.

## Смотрите также

- [SessionInterface::setName](set-name.md)
