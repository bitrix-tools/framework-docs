---
title: Проверить подключение файлов .min Asset::canUseMinifiedAssets
description: Статический метод Asset::canUseMinifiedAssets проверяет, подключает ли Asset файлы .min.js и .min.css вместо исходных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::canUseMinifiedAssets` проверяет, подключает ли класс файлы `.min.js` и `.min.css` вместо исходных. Если такой файл есть рядом с исходным, класс подключит его. Исходный файл класс подключит, только если он новее.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function canUseMinifiedAssets()
```

## Возвращаемое значение

Метод возвращает `true`, если параметр `use_minified_assets` главного модуля равен `Y`. Это значение по умолчанию.

## Особенности

Метод читает параметр один раз за запрос.

## Примеры

**Пример.** Код проверяет подключение файлов `.min`:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Asset::canUseMinifiedAssets());
```

Код выведет `bool(true)` при настройках по умолчанию.

## Смотрите также

- [Asset::getFullAssetPath](get-full-asset-path.md)
