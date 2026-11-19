---
title: Загрузить языковой файл Loc::loadLanguageFile
description: Метод Loc::loadLanguageFile сразу загружает фразы языкового файла для PHP-файла и возвращает их массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::loadLanguageFile` сразу загружает фразы для PHP-файла и возвращает их. В отличие от [loadMessages](load-messages.md), метод читает языковой файл в момент вызова. Метод подходит, когда нужны все фразы файла, например чтобы передать их в JavaScript.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function loadLanguageFile($file, $language = null, $normalize = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| file\* | `string` | Задает путь к PHP-файлу, для которого нужны фразы |
| language | `string`, `null` | Задает код языка. По умолчанию — `null`, текущий язык |
| normalize | `bool` | Приводит путь к единому виду методом `Path::normalize` при `true`. По умолчанию — `true` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает массив фраз, в котором ключ — код фразы, а значение — текст. Если языкового файла нет, метод возвращает пустой массив.

Метод сначала загружает фразы языка по умолчанию из [getDefaultLang](get-default-lang.md), затем заменяет их фразами запрошенного языка. Фразы, загруженные методом [loadCustomMessages](load-custom-messages.md), заменяют фразы с теми же кодами. Загруженные фразы становятся доступны в [getMessage](get-message.md).

## Особенности

Если определена константа `BX_MESS_CODE`, метод заменяет текст каждой фразы ее кодом. Так на странице видно, какой код у каждого текста.

Класс читает пользовательский файл фраз `/local/php_interface/user_lang/<язык>/lang.php`, а если его нет — `/bitrix/php_interface/user_lang/<язык>/lang.php`. Ключи массива `$MESS` в этом файле — пути к языковым файлам от корня сайта, значения — массивы фраз. Эти фразы заменяют фразы с теми же кодами в указанных языковых файлах.

## Примеры

**Пример.** Код загружает фразы установщика модуля `main` на английском и выводит одну из них:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$messages = Loc::loadLanguageFile($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php', 'en');

echo $messages['MAIN_EVERYONE_GROUP_NAME'];
```

Код выведет `All users (with non-authorized users)`.

## Смотрите также

- [Loc::loadMessages](load-messages.md)
- [Loc::loadCustomMessages](load-custom-messages.md)
