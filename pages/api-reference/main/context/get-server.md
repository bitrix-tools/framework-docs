---
title: Получить данные сервера Context::getServer
description: Метод Context::getServer возвращает объект Server с данными массива $_SERVER текущего запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getServer` возвращает данные сервера текущего запроса. Объект `Bitrix\Main\Server` содержит значения массива `$_SERVER` и методы для частых значений, например `getDocumentRoot`.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getServer()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Server`. Метод `get` объекта возвращает значение из `$_SERVER` по ключу, например `get('HTTP_USER_AGENT')`. До вызова [initialize](initialize.md) метод возвращает `null`.

## Примеры

**Пример.** Код выводит корневой каталог сайта:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Context::getCurrent()->getServer()->getDocumentRoot();
```

Код выведет путь к корню сайта, например `/var/www/html`.

## Смотрите также

- [Context::getRequest](get-request.md)
- [Context::getEnvironment](get-environment.md)
