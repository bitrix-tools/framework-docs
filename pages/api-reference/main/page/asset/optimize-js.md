---
title: Проверить объединение JS Asset::optimizeJs
description: Метод Asset::optimizeJs проверяет, объединяет ли Asset JS-файлы на текущей странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::optimizeJs` проверяет, объединяет ли класс JS-файлы на текущей странице. Метод [getJs](get-js.md) проверяет его перед выводом.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function optimizeJs()
```

## Возвращаемое значение

Метод возвращает `true` при всех условиях ниже.

- Метод [disableOptimizeJs](disable-optimize-js.md) не запретил объединение.
- Страница не из административного раздела.
- Параметр `optimize_js_files` главного модуля равен `Y`.
- Объект не в режиме AJAX.

Иначе метод возвращает `false`.

## Примеры

**Пример.** Код проверяет объединение JS:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Asset::getInstance()->optimizeJs());
```

Код выведет `bool(true)`, если объединение JS включено в настройках главного модуля.

## Смотрите также

- [Asset::optimizeCss](optimize-css.md)
