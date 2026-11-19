---
title: Получить хост Uri::getHost
description: Метод Uri::getHost возвращает хост адреса в нижнем регистре.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getHost` возвращает хост адреса без порта.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getHost(): string
```

## Возвращаемое значение

Метод возвращает хост в нижнем регистре или пустую строку для относительного адреса.

## Примеры

**Пример.** Код проверяет, что ссылка ведет на свой хост:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://Example.COM:8443/units/');

echo $uri->getHost() . ' ' . ($uri->getHost() === 'example.com' ? 'own' : 'external');
```

Код выведет `example.com own`.

## Смотрите также

- [Uri::setHost](set-host.md)
- [Uri::getAuthority](get-authority.md)
