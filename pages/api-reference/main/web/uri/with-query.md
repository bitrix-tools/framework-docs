---
title: Получить копию с другой строкой запроса Uri::withQuery
description: Метод Uri::withQuery возвращает копию адреса с другой строкой запроса и заменяет строку целиком.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::withQuery` возвращает копию адреса с другой строкой запроса. Метод заменяет строку целиком. Чтобы изменить отдельные параметры, используйте [addParams](add-params.md) и [deleteParams](delete-params.md). Метод входит в интерфейс PSR-7 `UriInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function withQuery(string $query): UriInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| query\* | `string` | Задает строку запроса без `?`. Метод не кодирует значение. Пустая строка убирает строку запроса |

## Возвращаемое значение

Метод возвращает новый объект `Uri`.

## Примеры

**Пример.** Код заменяет строку запроса:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('/units/?page=2&sort=name');

echo $uri->withQuery(http_build_query(['view' => 'grid']))->getUri() . ' ' . $uri->withQuery('')->getUri();
```

Код выведет `/units/?view=grid /units/`.

## Смотрите также

- [Uri::getQuery](get-query.md)
- [Uri::addParams](add-params.md)
