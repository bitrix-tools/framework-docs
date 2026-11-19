---
title: Разрешить объединение CSS Asset::enableOptimizeCss
description: Метод Asset::enableOptimizeCss снова разрешает объединение CSS-файлов на текущей странице после disableOptimizeCss.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::enableOptimizeCss` разрешает объединение CSS-файлов на текущей странице. По умолчанию объединение разрешено, поэтому метод нужен, только чтобы отменить [disableOptimizeCss](disable-optimize-css.md).

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function enableOptimizeCss()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод не включает объединение на сайте. Объединение работает, только если оно включено в настройках главного модуля. Итоговое значение возвращает [optimizeCss](optimize-css.md).

## Примеры

**Пример.** Код выключает и снова разрешает объединение CSS:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->disableOptimizeCss();
$disabled = $asset->optimizeCss();
$asset->enableOptimizeCss();

echo var_export($disabled, true) . ' ' . var_export($asset->optimizeCss(), true);
```

Код выведет `false true`, если объединение CSS включено в настройках главного модуля.

## Смотрите также

- [Asset::disableOptimizeCss](disable-optimize-css.md)
- [Asset::optimizeCss](optimize-css.md)
