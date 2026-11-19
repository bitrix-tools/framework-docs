---
title: Задать режим вывода Asset::setMode
description: Метод Asset::setMode задает режим композитного сайта — какие строки и наборы попадут в вывод.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::setMode` задает режим композитного сайта. Стандартная страница и ее композитная копия для кеша содержат разные строки и наборы. Методы [getStrings](get-strings.md), [getCss](get-css.md) и [getJs](get-js.md) выводят только строки и наборы, режим которых пересекается с текущим по битам. Строки и наборы с режимом `AssetMode::ALL` выводятся в любом режиме.

Композитный сайт вызывает метод сам. Он задает режим `COMPOSITE`, когда строит композитную копию страницы, и возвращает `STANDARD` после нее. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function setMode($mode = AssetMode::STANDARD)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| mode | `int` | Задает режим — константу `AssetMode`, например `AssetMode::COMPOSITE`. По умолчанию — `AssetMode::STANDARD` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код добавляет строки для двух режимов и выводит строки композитного режима:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetLocation;
use Bitrix\Main\Page\AssetMode;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance()->setAjax();
$asset->addString('<meta name="mode" content="standard">', false, AssetLocation::AFTER_JS, AssetMode::STANDARD);
$asset->addString('<meta name="mode" content="composite">', false, AssetLocation::AFTER_JS, AssetMode::COMPOSITE);
$asset->setMode(AssetMode::COMPOSITE);

echo trim($asset->getStrings(AssetLocation::AFTER_JS));
```

Код выведет `<meta name="mode" content="composite">`.

## Смотрите также

- [Asset::compositeTarget](composite-target.md)
- [Композитный сайт](../../../../performance/composite-site.md)
