---
title: Получить копию с другим фрагментом Uri::withFragment
description: Метод Uri::withFragment возвращает копию адреса с другим фрагментом после знака решетки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::withFragment` возвращает копию адреса с другим фрагментом. Метод не меняет исходный объект. Метод входит в интерфейс PSR-7 `UriInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function withFragment(string $fragment): UriInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fragment\* | `string` | Задает фрагмент без `#`. Метод не кодирует значение. Пустая строка убирает фрагмент |

## Возвращаемое значение

Метод возвращает новый объект `Uri`.

## Примеры

**Пример.** Код строит ссылку на якорь на странице:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('/units/list.php?page=2');

echo $uri->withFragment('unit-kg')->getUri();
```

Код выведет `/units/list.php?page=2#unit-kg`.

## Смотрите также

- [Uri::getFragment](get-fragment.md)
