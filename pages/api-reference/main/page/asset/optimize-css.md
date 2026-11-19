---
title: Проверить объединение CSS Asset::optimizeCss
description: Метод Asset::optimizeCss проверяет, объединяет ли Asset CSS-файлы на текущей странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::optimizeCss` проверяет, объединяет ли класс CSS-файлы на текущей странице. Метод [getCss](get-css.md) проверяет его перед выводом.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function optimizeCss()
```

## Возвращаемое значение

Метод возвращает `true` при всех условиях ниже.

- Метод [disableOptimizeCss](disable-optimize-css.md) не запретил объединение.
- Страница не из административного раздела.
- Параметр `optimize_css_files` главного модуля равен `Y`.
- Объект не в режиме AJAX.

Иначе метод возвращает `false`.

## Примеры

**Пример.** Код проверяет объединение CSS:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Asset::getInstance()->optimizeCss());
```

Код выведет `bool(true)`, если объединение CSS включено в настройках главного модуля.

## Смотрите также

- [Asset::optimizeJs](optimize-js.md)
- [Работа со стилями](../../../../cms-basics/styles.md)
