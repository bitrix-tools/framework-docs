---
title: Проверить CSS ядра Asset::isKernelCSS
description: Метод Asset::isKernelCSS проверяет, относится ли CSS-файл к ядру, и возвращает данные его модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::isKernelCSS` проверяет, относится ли CSS-файл к ядру. Класс вызывает метод сам, когда раскладывает файлы по наборам.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
function isKernelCSS($css)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| css\* | `string` | Задает путь к файлу без параметров |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Результат зависит от объединения CSS.

| Объединение | Файл | Результат |
| --- | --- | --- |
| Выключено | В `/bitrix/js/` или `/bitrix/css/` | `true` |
| Включено | Зарегистрирован методом [addCssKernelInfo](add-css-kernel-info.md) | Массив данных модуля с ключом `MODULE_ID` |
| Включено | В `/bitrix/js/` или `/bitrix/css/`, не зарегистрирован | Массив с ключом `MODULE_ID` вида `<модуль>_<номер>` и `SKIP` = `true`. Файл выведется своим тегом |
| Любое | Вне этих каталогов | `false` |

## Примеры

**Пример.** Код проверяет файл ядра и файл сайта:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();

echo var_export((bool)$asset->isKernelCSS('/bitrix/css/main/bootstrap.css'), true) . ' '
    . var_export($asset->isKernelCSS('/local/css/units.css'), true);
```

Код выведет `true false`.

## Смотрите также

- [Asset::addCssKernelInfo](add-css-kernel-info.md)
- [Asset::isKernelJS](is-kernel-js.md)
