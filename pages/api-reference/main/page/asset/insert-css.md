---
title: Получить тег CSS Asset::insertCss
description: Метод Asset::insertCss возвращает тег link для CSS-файла или тег style со встроенным CSS.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::insertCss` возвращает тег `link` для CSS-файла или тег `style` со встроенным CSS. Метод только строит HTML и не добавляет файл на страницу. Метод [getCss](get-css.md) вызывает его для каждого файла.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function insertCss($css, $label = false, $inline = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| css\* | `string` | Задает адрес файла или текст CSS |
| label | `bool` или `string` | Значение `true` добавляет атрибут `data-template-style="true"`. Строку метод добавляет в тег как есть. По умолчанию — `false` |
| inline | `bool` | Значение `true` возвращает тег `style` с текстом CSS. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку с тегом и переводом строки в конце.

## Особенности

Метод не экранирует адрес и текст CSS.

## Примеры

**Пример.** Код строит тег для файла шаблона:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo trim(Asset::getInstance()->insertCss('/local/css/units.css', true));
```

Код выведет `<link href="/local/css/units.css" type="text/css" rel="stylesheet" data-template-style="true"/>`.

## Смотрите также

- [Asset::insertJs](insert-js.md)
- [Asset::setXhtml](set-xhtml.md)
