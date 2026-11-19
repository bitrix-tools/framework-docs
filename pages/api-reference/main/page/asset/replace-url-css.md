---
title: Сделать адрес из CSS абсолютным Asset::replaceUrlCss
description: Статический метод Asset::replaceUrlCss делает относительный адрес из url() или @import абсолютным от каталога CSS-файла.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::replaceUrlCss` делает относительный адрес из CSS абсолютным от каталога CSS-файла. Метод [fixCssIncludes](fix-css-includes.md) вызывает его для каждого `url()` и `@import`. Без замены относительные адреса сломаются, когда CSS попадет в файл объединения в другом каталоге.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function replaceUrlCss($url, $quote, $path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает адрес из CSS |
| quote\* | `string` | Задает кавычку вокруг адреса — `'`, `"` или пустую строку |
| path\* | `string` | Задает каталог CSS-файла, например `/local/css` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает адрес в кавычках `quote`. Внешний адрес, адрес `data:`, якорь `#` и адрес от корня `/` метод не меняет.

## Примеры

**Пример.** Код заменяет относительный адрес и оставляет адрес от корня:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Asset::replaceUrlCss('img/kg.png', '"', '/local/css') . ' ' . Asset::replaceUrlCss('/img/kg.png', "'", '/local/css');
```

Код выведет `"/local/css/img/kg.png" '/img/kg.png'`.

## Смотрите также

- [Asset::fixCssIncludes](fix-css-includes.md)
