---
title: Получить копию с другим путем Uri::withPath
description: Метод Uri::withPath возвращает копию адреса с другим путем.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::withPath` возвращает копию адреса с другим путем. Метод не меняет исходный объект. Метод входит в интерфейс PSR-7 `UriInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function withPath(string $path): UriInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь. Метод не кодирует и не проверяет значение |

## Возвращаемое значение

Метод возвращает новый объект `Uri`.

## Примеры

**Пример.** Код строит ссылку на соседнюю страницу и сохраняет исходный адрес:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/units/list.php?sort=name');

echo $uri->withPath('/units/export.php')->getUri() . ' ' . $uri->getPath();
```

Код выведет `https://example.com/units/export.php?sort=name /units/list.php`.

## Смотрите также

- [Uri::setPath](set-path.md)
