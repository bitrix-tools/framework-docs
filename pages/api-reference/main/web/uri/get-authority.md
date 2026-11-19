---
title: Получить учетные данные, хост и порт Uri::getAuthority
description: Метод Uri::getAuthority возвращает часть адреса между схемой и путем — учетные данные, хост и нестандартный порт.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::getAuthority` возвращает часть адреса между `//` и путем в формате `user:password@host:port`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getAuthority(): string
```

## Возвращаемое значение

Метод возвращает строку.

- Метод добавляет учетные данные, если задано имя пользователя.
- Метод добавляет порт только для схем `http` и `https`, если порт не 80 и не 443. Для других схем порт в строку не попадает.
- Если хоста нет, метод возвращает учетные данные с `@`, например `api@`. Если нет и учетных данных, метод возвращает пустую строку.

## Примеры

**Пример.** Код сравнивает адреса со стандартным и нестандартным портом:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new Uri('https://api@example.com:443/'))->getAuthority() . ' ';
echo (new Uri('https://example.com:8443/'))->getAuthority();
```

Код выведет `api@example.com example.com:8443`.

## Смотрите также

- [Uri::getHost](get-host.md)
- [Uri::getUserInfo](get-user-info.md)
