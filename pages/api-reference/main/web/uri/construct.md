---
title: Создать объект адреса Uri::__construct
description: Конструктор Uri разбирает строку адреса функцией parse_url и сохраняет схему, хост, порт, учетные данные, путь, строку запроса и фрагмент.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Uri::__construct` разбирает строку адреса на части функцией PHP `parse_url`. Адрес может быть абсолютным, например `https://example.com/units/`, или относительным, например `/units/?page=2`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function __construct($url)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает адрес |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Особенности

- Конструктор приводит схему и хост к нижнему регистру.
- Конструктор раскодирует имя пользователя и пароль. Методы [getUser](get-user.md) и [getPass](get-pass.md) кодируют их снова.
- Класс не поддерживает адреса без схемы вида `//cdn.example.com/a.js`. Конструктор считает такую строку путем `/cdn.example.com/a.js`.
- Если `parse_url` не может разобрать адрес, например `http:///units`, объект остается пустым, и [getUri](get-uri.md) возвращает пустую строку.

## Примеры

**Пример.** Код разбирает адрес на части:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('HTTPS://Example.COM:8443/units/list.php?page=2#top');

echo implode(' ', [$uri->getScheme(), $uri->getHost(), $uri->getPort(), $uri->getPath(), $uri->getQuery(), $uri->getFragment()]);
```

Код выведет `https example.com 8443 /units/list.php page=2 top`.

## Смотрите также

- [Uri::getUri](get-uri.md)
