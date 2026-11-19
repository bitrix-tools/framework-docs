---
title: Удалить все значения SessionInterface::clear
description: Метод SessionInterface::clear удаляет все данные сессии и оставляет сессию запущенной.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::clear` удаляет все данные сессии. Сессия остается запущенной, идентификатор не меняется. Чтобы закрыть сессию, используйте [destroy](destroy.md).

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function clear();
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Класс `Session` очищает весь массив `$_SESSION`, в том числе данные других модулей и данные авторизации. Если не нужно сбросить сессию целиком, удаляйте только свои ключи методом [remove](remove.md).

## Примеры

**Пример.** Код очищает сессию и проверяет ключ:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('units_view', 'list');
$session->clear();

var_dump($session->has('units_view'));
```

Код выведет `bool(false)`.

## Смотрите также

- [SessionInterface::remove](remove.md)
- [SessionInterface::destroy](destroy.md)
