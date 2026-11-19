---
title: Получить пароль Uri::getPass
description: Метод Uri::getPass возвращает пароль из адреса в URL-кодировке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getPass` возвращает пароль из адреса вида `https://user:password@example.com/`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getPass()
```

## Возвращаемое значение

Метод кодирует пароль функцией `rawurlencode` и возвращает строку. Например, `@` станет `%40`. Если пароля нет, метод возвращает пустую строку.

## Примеры

**Пример.** Код читает пароль и раскодирует его:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://api:p%40ss@example.com/');

echo $uri->getPass() . ' ' . rawurldecode($uri->getPass());
```

Код выведет `p%40ss p@ss`.

## Смотрите также

- [Uri::setPass](set-pass.md)
- [Uri::getUserInfo](get-user-info.md)
