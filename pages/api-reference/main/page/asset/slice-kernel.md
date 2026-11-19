---
title: Проверить выделение файлов ядра Asset::sliceKernel
description: Метод Asset::sliceKernel проверяет, выделяет ли Asset файлы ядра в отдельные наборы по модулям.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::sliceKernel` проверяет, выделяет ли класс файлы ядра в отдельные наборы по модулям, например `KERNEL_main`. Так файлы ядра попадают в общие для всех страниц файлы объединения, и браузер берет их из кеша.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function sliceKernel()
```

## Возвращаемое значение

Метод возвращает `false` в административном разделе, иначе `true`.

## Примеры

**Пример.** Код проверяет выделение файлов ядра в публичной части:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Asset::getInstance()->sliceKernel());
```

Код выведет `bool(true)`.

## Смотрите также

- [Asset::isKernelJS](is-kernel-js.md)
