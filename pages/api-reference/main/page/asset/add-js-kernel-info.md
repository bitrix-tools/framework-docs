---
title: Зарегистрировать JS модуля ядра Asset::addJsKernelInfo
description: Метод Asset::addJsKernelInfo регистрирует JS-файлы как файлы модуля ядра — они попадут в общий файл объединения модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::addJsKernelInfo` регистрирует JS-файлы как файлы модуля ядра. Когда страница подключит такой файл, класс положит его в набор `KERNEL_<модуль>` и объединит с другими файлами модуля в общий файл.

Класс `CJSCore` вызывает метод сам для расширений с ключом `bundle_js` в конфигурации. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
function addJsKernelInfo($module = '', $js = [], $settings = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| module | `string` | Задает имя модуля или расширения. По умолчанию — пустая строка |
| js | `array` | Задает пути к JS-файлам. По умолчанию — пустой массив |
| settings | `array` | Задает настройки — ключ `DATA` с атрибутами тега `script` файла объединения. По умолчанию — пустой массив |

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
$asset->addJsKernelInfo('vendor_units', ['/bitrix/js/vendor.units/units.js']);

$info = $asset->isKernelJS('/bitrix/js/vendor.units/units.js');

echo is_array($info) ? $info['MODULE_ID'] : var_export($info, true);
```

Код выведет `vendor_units`, если объединение JS включено. Иначе код выведет `true`.

## Смотрите также

- [Asset::isKernelJS](is-kernel-js.md)
- [Asset::groupJs](group-js.md)
