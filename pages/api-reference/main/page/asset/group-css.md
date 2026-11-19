---
title: Объединить CSS модулей ядра Asset::groupCss
description: Метод Asset::groupCss перекладывает CSS одного модуля ядра в файл объединения другого модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::groupCss` перекладывает CSS-файлы модуля ядра `from` в набор модуля `to`. Файлы обоих модулей попадут в один файл объединения, и браузер сделает на один запрос меньше. Метод нужен, когда страница всегда подключает оба модуля вместе.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function groupCss($from = '', $to = '')
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

- Метод работает только при включенном объединении CSS и для файлов, которые зарегистрировал [addCssKernelInfo](add-css-kernel-info.md).
- Модули, которые раньше перенесли в `from`, тоже переходят в `to`.

## Примеры

**Пример.** Код переносит CSS одного модуля в набор другого:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addCssKernelInfo('vendor_units', ['/bitrix/css/vendor.units/units.css']);
$asset->groupCss('vendor_units', 'main');

$info = $asset->isKernelCSS('/bitrix/css/vendor.units/units.css');

echo is_array($info) ? $info['MODULE_ID'] : var_export($info, true);
```

Код выведет `main`, если объединение CSS включено.

## Смотрите также

- [Asset::groupJs](group-js.md)
- [Asset::addCssKernelInfo](add-css-kernel-info.md)
