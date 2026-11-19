---
title: Загрузить замены фраз Loc::loadCustomMessages
description: Метод Loc::loadCustomMessages загружает фразы из языкового файла, которые заменят фразы с теми же кодами при следующей загрузке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::loadCustomMessages` загружает фразы-замены из языкового файла. Когда метод [loadLanguageFile](load-language-file.md) загружает фразу с тем же кодом, он подставляет текст замены.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function loadCustomMessages($file, $language = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| file\* | `string` | Задает путь к PHP-файлу. Метод ищет для него языковой файл так же, как [loadLanguageFile](load-language-file.md) |
| language | `string`, `null` | Задает код языка. По умолчанию — `null`, текущий язык |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Замены действуют только на фразы, которые класс загружает после вызова метода. Уже загруженные фразы метод не меняет. Вызывайте метод до первого обращения к фразам, которые нужно заменить.

## Примеры

**Пример.** Код создает языковой файл с заменой фразы `MAIN_EVERYONE_GROUP_NAME`, загружает замену и выводит фразу. В блоке `finally` код удаляет созданные файлы:

```php
<?php
use Bitrix\Main\IO\Directory;
use Bitrix\Main\IO\File;
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$dir = $_SERVER['DOCUMENT_ROOT'] . '/upload/demo-loc';
File::putFileContents($dir . '/lang/en/custom.php', "<?php\n\$MESS['MAIN_EVERYONE_GROUP_NAME'] = 'Everyone';\n");

try
{
    Loc::loadCustomMessages($dir . '/custom.php', 'en');

    $messages = Loc::loadLanguageFile($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php', 'en');
    echo $messages['MAIN_EVERYONE_GROUP_NAME'];
}
finally
{
    Directory::deleteDirectory($dir);
}
```

Код выведет `Everyone`.

## Смотрите также

- [Loc::loadLanguageFile](load-language-file.md)
