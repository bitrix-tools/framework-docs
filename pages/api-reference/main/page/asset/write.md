---
title: Записать файл объединения Asset::write
description: Метод Asset::write записывает файл через временный файл и, если включено сжатие, создает рядом копию .gz.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::write` записывает файл объединения. Метод сначала пишет во временный файл `.tmp` и затем переименовывает его, поэтому браузер не получит недописанный файл. Если [gzipEnabled](gzip-enabled.md) возвращает `true`, метод создает рядом сжатую копию `.gz`.

Класс вызывает метод сам при объединении. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
function write($filePath, $content, $gzip = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filePath\* | `string` | Задает абсолютный путь к файлу |
| content\* | `string` | Задает содержимое |
| gzip | `bool` | Значение `false` не создает копию `.gz`. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если записал файл целиком, иначе `false`.

## Особенности

Метод создает недостающие каталоги и задает файлу права из константы `BX_FILE_PERMISSIONS`.

## Примеры

**Пример.** Код записывает файл, читает его и удаляет:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = $_SERVER['DOCUMENT_ROOT'] . '/upload/vendor_units/units.css';

var_dump(Asset::getInstance()->write($path, '.unit { color: #333; }', false));
echo file_get_contents($path);

unlink($path);
rmdir(dirname($path));
```

Код выведет:

```text
bool(true)
.unit { color: #333; }
```

## Смотрите также

- [Asset::gzipEnabled](gzip-enabled.md)
