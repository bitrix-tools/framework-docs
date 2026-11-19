---
title: Получить копию с другими учетными данными Uri::withUserInfo
description: Метод Uri::withUserInfo возвращает копию адреса с другим именем пользователя и паролем.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::withUserInfo` возвращает копию адреса с другим именем пользователя и паролем. Метод не меняет исходный объект. Метод входит в интерфейс PSR-7 `UriInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function withUserInfo(string $user, ?string $password = null): UriInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| user\* | `string` | Задает имя пользователя. Пустая строка убирает учетные данные из адреса |
| password | `string` или `null` | Задает пароль. По умолчанию — `null`, адрес без пароля |

## Возвращаемое значение

Метод возвращает новый объект `Uri`.

## Особенности

Метод раскодирует имя и пароль, как [setUser](set-user.md) и [setPass](set-pass.md).

## Примеры

**Пример.** Код добавляет учетные данные в копию адреса:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/feed.xml');

echo $uri->withUserInfo('api', 'secret')->getUri() . ' ' . $uri->getUri();
```

Код выведет `https://api:secret@example.com/feed.xml https://example.com/feed.xml`.

## Смотрите также

- [Uri::getUserInfo](get-user-info.md)
