---
title: Включить стиль XHTML Asset::setXhtml
description: Метод Asset::setXhtml включает или выключает закрывающий слеш в тегах link, которые выводит Asset.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::setXhtml` включает или выключает закрывающий слеш в тегах `link`, например `<link ... />`. Метод `$APPLICATION->ShowHead()` вызывает его сам со своим аргументом `$bXhtmlStyle`.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function setXhtml($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `bool` | Значение `true` включает слеш. Любое другое значение выключает его |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

По умолчанию слеш включен.

## Примеры

**Пример.** Код выключает слеш и строит тег `link`:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->setXhtml(false);

echo trim($asset->insertCss('/local/css/units.css'));
```

Код выведет `<link href="/local/css/units.css" type="text/css" rel="stylesheet">`.

## Смотрите также

- [Asset::insertCss](insert-css.md)
