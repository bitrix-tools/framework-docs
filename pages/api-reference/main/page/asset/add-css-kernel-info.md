---
title: Зарегистрировать CSS модуля ядра Asset::addCssKernelInfo
description: Метод Asset::addCssKernelInfo регистрирует CSS-файлы как файлы модуля ядра — они попадут в общий файл объединения модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::addCssKernelInfo` регистрирует CSS-файлы как файлы модуля ядра. Когда страница подключит такой файл, класс положит его в набор `KERNEL_<модуль>` и объединит с другими файлами модуля в общий файл. Этот файл одинаков на всех страницах, поэтому браузер берет его из кеша.

Класс `CJSCore` вызывает метод сам для расширений с ключом `bundle_css` в конфигурации. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
function addCssKernelInfo($module = '', $css = [], $settings = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| module | `string` | Задает имя модуля или расширения. По умолчанию — пустая строка |
| css | `array` | Задает пути к CSS-файлам. По умолчанию — пустой массив |
| settings | `array` | Задает настройки — ключ `DATA` с атрибутами тега `link` файла объединения и ключ `LOCATION` с местом вывода. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Если имя модуля или список файлов пустые, метод ничего не делает.

## Примеры

**Пример.** Код регистрирует файл модуля и проверяет его:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addCssKernelInfo('vendor_units', ['/bitrix/css/vendor.units/units.css']);

$info = $asset->isKernelCSS('/bitrix/css/vendor.units/units.css');

echo is_array($info) ? $info['MODULE_ID'] : var_export($info, true);
```

Код выведет `vendor_units`, если объединение CSS включено. Иначе код выведет `true`.

## Смотрите также

- [Asset::isKernelCSS](is-kernel-css.md)
- [Asset::addJsKernelInfo](add-js-kernel-info.md)
