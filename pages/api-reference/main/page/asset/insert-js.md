---
title: Получить тег JS Asset::insertJs
description: Метод Asset::insertJs возвращает тег script для JS-файла или со встроенным кодом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::insertJs` возвращает тег `script` для JS-файла или со встроенным кодом. Метод только строит HTML и не добавляет файл на страницу.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function insertJs($js, $label = '', $inline = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| js\* | `string` | Задает адрес файла или код JS |
| label | `string` | Задает атрибуты тега, например `defer`. По умолчанию — пустая строка |
| inline | `bool` | Значение `true` возвращает тег с кодом внутри. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку с тегом и переводом строки в конце.

## Особенности

Метод не экранирует адрес и код. После `<script` метод всегда ставит пробел, поэтому без атрибутов тег выглядит как `<script  src="...">`.

## Примеры

**Пример.** Код строит тег с атрибутом `defer`:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo trim(Asset::getInstance()->insertJs('/local/js/units.js', 'defer'));
```

Код выведет `<script defer src="/local/js/units.js"></script>`.

## Смотрите также

- [Asset::insertCss](insert-css.md)
