---
title: Объединить JS модулей ядра Asset::groupJs
description: Метод Asset::groupJs перекладывает JS одного модуля ядра в файл объединения другого модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::groupJs` перекладывает JS-файлы модуля ядра `from` в набор модуля `to`. Файлы обоих модулей попадут в один файл объединения, и браузер сделает на один запрос меньше. Метод нужен, когда страница всегда подключает оба модуля вместе.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function groupJs($from = '', $to = '')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| from | `string` | Задает модуль, файлы которого метод переносит. По умолчанию — пустая строка |
| to | `string` | Задает модуль, в набор которого метод переносит файлы. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Если один из модулей не задан, метод ничего не делает.

## Особенности

- Метод работает только при включенном объединении JS и для файлов, которые зарегистрировал [addJsKernelInfo](add-js-kernel-info.md).
- Модули, которые раньше перенесли в `from`, тоже переходят в `to`.

## Примеры

**Пример.** Код переносит JS одного модуля в набор другого:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addJsKernelInfo('vendor_units', ['/bitrix/js/vendor.units/units.js']);
$asset->groupJs('vendor_units', 'main');

$info = $asset->isKernelJS('/bitrix/js/vendor.units/units.js');

echo is_array($info) ? $info['MODULE_ID'] : var_export($info, true);
```

Код выведет `main`, если объединение JS включено.

## Смотрите также

- [Asset::groupCss](group-css.md)
- [Asset::moveJs](move-js.md)
