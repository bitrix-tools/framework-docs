---
title: Asset — подключение CSS, JS и строк на страницу
description: Класс Bitrix\Main\Page\Asset подключает к странице CSS- и JS-файлы и строки, раскладывает их по наборам и объединяет в файлы объединения.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Page`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.9.4

{% endnote %}

## Когда использовать

Класс `Asset` подключает к странице CSS- и JS-файлы и произвольные строки, например метатеги. Объект один на запрос, его возвращает метод [getInstance](get-instance.md). Код страницы, шаблона или компонента добавляет файлы, а метод `$APPLICATION->ShowHead()` в шаблоне сайта выводит их в секции `<head>`.

```php
use Bitrix\Main\Page\Asset;

$asset = Asset::getInstance();
$asset->addCss(SITE_TEMPLATE_PATH . '/css/units.css');
$asset->addJs(SITE_TEMPLATE_PATH . '/js/units.js');
$asset->addString('<meta name="theme-color" content="#2fc6f6">');
```

Класс раскладывает файлы по наборам. Набор определяет, в какой файл объединения попадет файл и где он выведется на странице.

| Набор | Что входит |
| --- | --- |
| `KERNEL` | Файлы ядра и модулей из `/bitrix/js/` и `/bitrix/css/` и внешние файлы |
| `TEMPLATE` | Файлы шаблона сайта — их добавляют в `header.php` и `footer.php` |
| `PAGE` | Файлы страницы и компонентов рабочей области |
| `BODY` | Скрипты для конца страницы. Если шаблон не вызывает `$APPLICATION->ShowBodyScripts()`, класс выводит их в `head` |

Если в настройках главного модуля включено объединение CSS или JS, класс собирает файлы набора в один файл в каталоге `/bitrix/cache/css/` или `/bitrix/cache/js/`.

Подробнее — в статье [Работа со стилями](../../../../cms-basics/styles.md).

{% note warning "" %}

Метод `setMaxCss` устарел и ничего не делает. Метод `moveJsToBody` — служебный, ядро вызывает его само.

{% endnote %}

## Методы класса

### Объект и режимы

| Метод | Описание | С версии |
| --- | --- | --- |
| [getInstance](get-instance.md) | Возвращает объект | |
| [setAjax](set-ajax.md) | Создает новый объект для ответа на AJAX-запрос | |
| [setMode](set-mode.md) | Задает режим композитного сайта | |
| [setXhtml](set-xhtml.md) | Включает закрывающий слеш в теге `link` | |

### Подключение файлов и строк

| Метод | Описание | С версии |
| --- | --- | --- |
| [addCss](add-css.md) | Добавляет CSS-файл | |
| [addJs](add-js.md) | Добавляет JS-файл | |
| [addString](add-string.md) | Добавляет строку HTML на страницу | |
| [getStrings](get-strings.md) | Возвращает строки для места на странице | |
| [getLocationByName](get-location-by-name.md) | Переводит старое обозначение места в константу `AssetLocation` | |

### Вывод на страницу

| Метод | Описание | С версии |
| --- | --- | --- |
| [getCss](get-css.md) | Возвращает HTML подключения CSS | |
| [getJs](get-js.md) | Возвращает HTML подключения JS и строк | |
| [showFilesList](show-files-list.md) | Возвращает скрипт со списком подключенных файлов для JS-ядра | |
| [insertCss](insert-css.md) | Возвращает тег `link` или `style` | |
| [insertJs](insert-js.md) | Возвращает тег `script` | |
| [setShowHeadString](set-show-head-string.md) | Отмечает, что шаблон выводит строки в `head` | |
| [getShowHeadString](get-show-head-string.md) | Проверяет, выводит ли шаблон строки в `head` | |
| [setShowHeadScript](set-show-head-script.md) | Отмечает, что шаблон выводит скрипты отдельно | |
| [setShowBodyScript](set-show-body-script.md) | Отмечает, что шаблон выводит скрипты в конце страницы | |

### Наборы

| Метод | Описание | С версии |
| --- | --- | --- |
| [getTargetName](get-target-name.md) | Возвращает имя текущего набора | |
| [getTarget](get-target.md) | Возвращает текущий набор | |
| [startTarget](start-target.md) | Начинает набор | |
| [startSet](start-set.md) | Начинает набор, то же, что `startTarget` | |
| [stopTarget](stop-target.md) | Завершает текущий набор | |
| [compositeTarget](composite-target.md) | Переводит набор в режим `AssetMode::COMPOSITE` | |
| [setUnique](set-unique.md) | Задает набору постоянный файл объединения | |
| [getTargetList](get-target-list.md) | Возвращает список наборов | |
| [getAssetInfo](get-asset-info.md) | Возвращает файлы и строки набора | |

### Оптимизация

| Метод | Описание | С версии |
| --- | --- | --- |
| [enableOptimizeCss](enable-optimize-css.md) | Разрешает объединение CSS | |
| [disableOptimizeCss](disable-optimize-css.md) | Запрещает объединение CSS | |
| [enableOptimizeJs](enable-optimize-js.md) | Разрешает объединение JS | |
| [disableOptimizeJs](disable-optimize-js.md) | Запрещает объединение JS | |
| [optimizeCss](optimize-css.md) | Проверяет, объединяет ли класс CSS-файлы | |
| [optimizeJs](optimize-js.md) | Проверяет, объединяет ли класс JS-файлы | |
| [sliceKernel](slice-kernel.md) | Проверяет, выделяет ли класс файлы ядра в отдельные наборы | |
| [canUseMinifiedAssets](can-use-minified-assets.md) | Проверяет, подключает ли класс файлы `.min` | |
| [gzipEnabled](gzip-enabled.md) | Проверяет, сжимает ли класс файлы объединения в gzip | |
| [write](write.md) | Записывает файл объединения | |

### Файлы ядра и модулей

| Метод | Описание | С версии |
| --- | --- | --- |
| [addCssKernelInfo](add-css-kernel-info.md) | Регистрирует CSS-файлы модуля ядра | |
| [addJsKernelInfo](add-js-kernel-info.md) | Регистрирует JS-файлы модуля ядра | |
| [isKernelCSS](is-kernel-css.md) | Проверяет, относится ли CSS-файл к ядру | |
| [isKernelJS](is-kernel-js.md) | Проверяет, относится ли JS-файл к ядру | |
| [groupCss](group-css.md) | Переносит CSS модуля ядра в файл объединения другого модуля | |
| [groupJs](group-js.md) | Переносит JS модуля ядра в файл объединения другого модуля | |
| [moveJs](move-js.md) | Переносит JS модуля ядра в конец страницы | |

### Скрипты в конце страницы

| Метод | Описание | С версии |
| --- | --- | --- |
| [setJsToBody](set-js-to-body.md) | Включает перенос всех скриптов в конец `body` | |
| [canMoveJsToBody](can-move-js-to-body.md) | Проверяет, переносит ли ядро скрипты в конец `body` | |

### Пути и содержимое CSS

| Метод | Описание | С версии |
| --- | --- | --- |
| [getAssetPath](get-asset-path.md) | Удаляет параметры из пути к файлу | |
| [getAssetTime](get-asset-time.md) | Возвращает метку времени из пути к файлу | |
| [getFullAssetPath](get-full-asset-path.md) | Возвращает адрес файла с меткой времени | |
| [replaceUrlCss](replace-url-css.md) | Делает относительный адрес из CSS абсолютным | |
| [fixCssIncludes](fix-css-includes.md) | Исправляет относительные адреса в содержимом CSS | |

## Константы

Места для строк задают константы класса `Bitrix\Main\Page\AssetLocation`.

| Константа | Где выводится строка |
| --- | --- |
| `BEFORE_CSS` | Перед CSS-файлами |
| `AFTER_CSS` | После CSS-файлов, перед скриптами ядра |
| `AFTER_JS_KERNEL` | После скриптов ядра. Значение по умолчанию |
| `AFTER_JS` | После всех скриптов в `head` |
| `BODY_END` | Вместе со скриптами набора `BODY` — в конце страницы, если шаблон вызывает `ShowBodyScripts()`, иначе в `head` |

Режимы композитного сайта задают константы класса `Bitrix\Main\Page\AssetMode`. Класс выводит строку или набор, если их режим пересекается с текущим режимом по битам.

| Константа | Значение | Описание |
| --- | --- | --- |
| `STANDARD` | `1` | Стандартная страница |
| `COMPOSITE` | `2` | Композитная копия страницы для кеша |
| `SPECIAL` | `4` | Особый режим вывода |
| `ALL` | `7` | Все режимы |

## Смотрите также

- [Работа со стилями](../../../../cms-basics/styles.md)
- [Шаблоны сайтов](../../../../cms-basics/site-templates.md)
- [Композитный сайт](../../../../performance/composite-site.md)
