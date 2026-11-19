---
title: Проверить сжатие gzip Asset::gzipEnabled
description: Статический метод Asset::gzipEnabled проверяет, сохраняет ли Asset рядом с файлом объединения его копию в gzip.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::gzipEnabled` проверяет, сохраняет ли класс рядом с файлом объединения его сжатую копию `.gz`. Веб-сервер может отдавать готовую сжатую копию и не сжимать файл на каждый запрос.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function gzipEnabled()
```

## Возвращаемое значение

Метод возвращает `true`, если параметр `compres_css_js_files` главного модуля равен `Y` и в PHP есть расширение `zlib`. Иначе метод возвращает `false`.

## Особенности

Метод проверяет условия один раз за запрос.

## Примеры

**Пример.** Код проверяет сжатие:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Asset::gzipEnabled());
```

Код выведет `bool(false)` при настройках по умолчанию.

## Смотрите также

- [Asset::write](write.md)
