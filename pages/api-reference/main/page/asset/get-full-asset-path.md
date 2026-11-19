---
title: Получить адрес файла с меткой времени Asset::getFullAssetPath
description: Метод Asset::getFullAssetPath возвращает адрес файла с меткой времени изменения и подставляет файл .min, если он есть.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getFullAssetPath` возвращает адрес файла с меткой времени изменения, например `/local/js/units.js?1700000000`. Если рядом лежит файл `.min` и исходный файл не новее его, метод вернет адрес `.min`. Метод нужен, чтобы вывести тег для файла вручную с тем же адресом, который построил бы класс.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getFullAssetPath($sourcePath)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sourcePath\* | `string` | Задает путь к файлу от корня сайта или внешний адрес |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает адрес с меткой времени. Внешний адрес метод возвращает без изменений. Если локального файла нет или он пустой, метод возвращает `null`.

## Примеры

**Пример.** Код получает адрес файла JS-ядра и несуществующего файла:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();

echo preg_replace('/\?\d+$/', '?<time>', $asset->getFullAssetPath('/bitrix/js/main/core/core.js')) . ' '
    . var_export($asset->getFullAssetPath('/local/js/missing.js'), true);
```

Код выведет `/bitrix/js/main/core/core.min.js?<time> NULL`. Метод подставил файл `core.min.js`.

## Смотрите также

- [Asset::canUseMinifiedAssets](can-use-minified-assets.md)
- [Asset::getAssetTime](get-asset-time.md)
