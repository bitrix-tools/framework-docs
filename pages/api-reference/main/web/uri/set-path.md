---
title: Задать путь Uri::setPath
description: Метод Uri::setPath заменяет путь адреса и сохраняет хост, строку запроса и фрагмент.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.10

{% endnote %}

Метод `Uri::setPath` заменяет путь адреса. Метод не меняет хост, строку запроса и фрагмент. Метод меняет сам объект. Чтобы получить копию, используйте [withPath](with-path.md).

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function setPath($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь. Метод не кодирует и не проверяет значение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Примеры

**Пример.** Код переводит ссылку на другую страницу с теми же параметрами:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/units/list.php?sort=name');
$uri->setPath('/units/export.php');

echo $uri->getUri();
```

Код выведет `https://example.com/units/export.php?sort=name`.

## Смотрите также

- [Uri::getPath](get-path.md)
- [Uri::withPath](with-path.md)
