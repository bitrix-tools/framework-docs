---
title: Исправить адреса в CSS Asset::fixCssIncludes
description: Статический метод Asset::fixCssIncludes делает абсолютными относительные адреса url() и @import в содержимом CSS-файла.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::fixCssIncludes` делает абсолютными относительные адреса `url()` и `@import` в содержимом CSS-файла. Класс вызывает метод сам, когда собирает файл объединения. Метод нужен, если код сам переносит CSS в другой каталог или вставляет его в страницу тегом `style`.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function fixCssIncludes($content, $path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| content\* | `string` | Задает содержимое CSS |
| path\* | `string` | Задает путь к CSS-файлу, например `/local/css/units.css`. Метод берет из него каталог |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает содержимое CSS с исправленными адресами.

## Примеры

**Пример.** Код исправляет адреса картинки и подключаемого файла:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Asset::fixCssIncludes(".unit { background: url(img/kg.png); } @import 'base.css';", '/local/css/units.css');
```

Код выведет `.unit { background: url(/local/css/img/kg.png); } @import '/local/css/base.css';`.

## Смотрите также

- [Asset::replaceUrlCss](replace-url-css.md)
