---
title: Получить место строки Asset::getLocationByName
description: Статический метод Asset::getLocationByName переводит старое обозначение места строки — true, false или DEFAULT — в константу AssetLocation.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::getLocationByName` переводит старое обозначение места строки в константу `AssetLocation`. Старый метод `$APPLICATION->AddHeadString` принимал место как `true` или `false`. Метод нужен коду, который принимает оба формата.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function getLocationByName($location)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| location\* | `bool` или `string` | Задает место — `true`, `false`, `'DEFAULT'` или константу `AssetLocation` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

| Значение `location` | Результат |
| --- | --- |
| `false` или `'DEFAULT'` | `AssetLocation::AFTER_JS_KERNEL` |
| `true` | `AssetLocation::AFTER_CSS` |
| Другое значение | То же значение без изменений |

## Примеры

**Пример.** Код переводит старые обозначения:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Asset::getLocationByName(true) . ' ' . Asset::getLocationByName('DEFAULT') . ' ' . Asset::getLocationByName('AFTER_JS');
```

Код выведет `AFTER_CSS AFTER_JS_KERNEL AFTER_JS`.

## Смотрите также

- [Asset::addString](add-string.md)
