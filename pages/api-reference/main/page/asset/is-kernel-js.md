---
title: Проверить JS ядра Asset::isKernelJS
description: Метод Asset::isKernelJS проверяет, относится ли JS-файл к ядру, и возвращает данные его модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::isKernelJS` проверяет, относится ли JS-файл к ядру. Класс вызывает метод сам, когда раскладывает файлы по наборам.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
function isKernelJS($js)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| js\* | `string` | Задает путь к файлу без параметров |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Результат зависит от объединения JS.

| Объединение | Файл | Результат |
| --- | --- | --- |
| Выключено | В `/bitrix/js/` | `true` |
| Включено | Зарегистрирован методом [addJsKernelInfo](add-js-kernel-info.md) | Массив данных модуля с ключами `MODULE_ID` и `BODY` |
| Включено | В `/bitrix/js/`, не зарегистрирован | Массив с ключом `MODULE_ID` вида `<модуль>_<номер>` и `SKIP` = `true`. Файл выведется своим тегом |
| Любое | Вне `/bitrix/js/` | `false` |

## Примеры

**Пример.** Код проверяет файл JS-ядра:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$info = Asset::getInstance()->isKernelJS('/bitrix/js/main/core/core.js');

echo is_array($info) ? $info['MODULE_ID'] : var_export($info, true);
```

Код выведет `main`, если объединение JS включено. Иначе код выведет `true`.

## Смотрите также

- [Asset::addJsKernelInfo](add-js-kernel-info.md)
- [Asset::isKernelCSS](is-kernel-css.md)
