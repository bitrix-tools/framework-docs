---
title: Добавить строку Asset::addString
description: Метод Asset::addString добавляет на страницу произвольную строку HTML — метатег, ссылку или скрипт.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::addString` добавляет строку HTML на страницу, например метатег, тег `link` или встроенный скрипт. Параметр `location` задает место строки относительно CSS и скриптов.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
function addString($str, $unique = false, $location = AssetLocation::AFTER_JS_KERNEL, $mode = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| str\* | `string` | Задает строку HTML |
| unique | `bool` | Значение `true` добавляет строку один раз, даже если метод вызвали несколько раз. По умолчанию — `false` |
| location | `string` | Задает место — константу `AssetLocation`, например `AssetLocation::AFTER_CSS`. По умолчанию — `AssetLocation::AFTER_JS_KERNEL` |
| mode | `int` или `null` | Задает режим композитного сайта — константу `AssetMode`. По умолчанию — `null`, тогда строка получает режим текущего набора |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`. Если строка пустая, метод возвращает `false`.

## Особенности

Метод не экранирует строку. Значения из запроса перед добавлением экранируйте, например функцией `htmlspecialcharsbx`.

## Примеры

**Пример.** Код добавляет метатег один раз, хотя вызывает метод дважды:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetLocation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addString('<meta name="unit" content="kg">', true, AssetLocation::AFTER_JS);
$asset->addString('<meta name="unit" content="kg">', true, AssetLocation::AFTER_JS);

echo substr_count($asset->getStrings(AssetLocation::AFTER_JS), 'name="unit"');
```

Код выведет `1`.

## Смотрите также

- [Asset::getStrings](get-strings.md)
- [Asset::getLocationByName](get-location-by-name.md)
