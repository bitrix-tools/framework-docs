---
title: Получить файлы и строки набора Asset::getAssetInfo
description: Метод Asset::getAssetInfo возвращает CSS- и JS-файлы и строки набора для режима композитного сайта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getAssetInfo` возвращает CSS- и JS-файлы и строки набора. Композитный сайт вызывает метод, чтобы передать вместе с содержимым динамической области ее файлы. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getAssetInfo($id, $mode)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает имя набора |
| mode\* | `int` | Задает режим — константу `AssetMode` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив с ключами `JS`, `BUNDLE_JS`, `CSS`, `BUNDLE_CSS`, `STRINGS`. В `JS` и `CSS` — адреса файлов, в `BUNDLE_JS` и `BUNDLE_CSS` — исходные файлы в составе файлов объединения, в `STRINGS` — строки набора.

## Особенности

- Метод читает файлы, которые подготовили [getCss](get-css.md) и [getJs](get-js.md). Вызывайте его после них.
- Первый вызов для режима запоминает результат.
- В результат попадают строки, режим которых равен `mode`, а не пересекается с ним.

## Примеры

**Пример.** Код добавляет файл и строку в свой набор и читает их:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetMode;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->startTarget('units', AssetMode::COMPOSITE);
$asset->addCss('https://cdn.example.com/units.css');
$asset->addString('<meta name="unit" content="kg">', false, 'AFTER_JS', AssetMode::COMPOSITE);
$asset->stopTarget();
$asset->getCss();
$asset->getJs();

echo json_encode($asset->getAssetInfo('units', AssetMode::COMPOSITE)['STRINGS']);
```

Код выведет `["<meta name=\"unit\" content=\"kg\">"]`.

## Смотрите также

- [Asset::startTarget](start-target.md)
- [Композитный сайт](../../../../performance/composite-site.md)
