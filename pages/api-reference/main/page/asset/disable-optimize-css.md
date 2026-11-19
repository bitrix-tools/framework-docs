---
title: Запретить объединение CSS Asset::disableOptimizeCss
description: Метод Asset::disableOptimizeCss запрещает объединение CSS-файлов на текущей странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::disableOptimizeCss` запрещает объединение CSS-файлов на текущей странице. Каждый файл выведется своим тегом `link`. Метод нужен, например, на странице, где порядок файлов важнее скорости, или для отладки стилей.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function disableOptimizeCss()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Вызовите метод до вывода CSS, например в начале страницы. После [getCss](get-css.md) вызов не действует.

## Примеры

**Пример.** Код запрещает объединение и проверяет итоговое значение:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->disableOptimizeCss();

var_dump($asset->optimizeCss());
```

Код выведет `bool(false)`.

## Смотрите также

- [Asset::enableOptimizeCss](enable-optimize-css.md)
- [Работа со стилями](../../../../cms-basics/styles.md)
