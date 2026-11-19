---
title: Сбросить OPcache Application::resetAccelerator
description: Статический метод Application::resetAccelerator сбрасывает кеш OPcache целиком или для одного файла, чтобы PHP прочитал измененный код.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Application::resetAccelerator` сбрасывает кеш скомпилированного кода OPcache. Метод нужен после того, как код записал PHP-файл, например файл настроек. Без сброса PHP может выполнять старую версию файла. Ядро вызывает метод само после установки обновлений и изменения `urlrewrite.php`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public static function resetAccelerator(?string $filename = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| filename | `string` или `null` | Задает абсолютный путь к файлу. По умолчанию — `null`, тогда метод сбрасывает весь кеш OPcache |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод ничего не делает, если определена константа `BX_NO_ACCELERATOR_RESET` или в `.settings.php` задан ключ `no_accelerator_reset`.
- Если расширение OPcache не загружено, метод ничего не делает.

## Примеры

**Пример.** Код записывает PHP-файл и сбрасывает его кеш:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Application::getDocumentRoot() . '/upload/vendor_units.php';
File::putFileContents($path, '<?php return ["kg", "g"];');
Application::resetAccelerator($path);

echo implode(',', include $path);
File::deleteFile($path);
```

Код выведет `kg,g`.

## Смотрите также

- [Application::getDocumentRoot](get-document-root.md)
