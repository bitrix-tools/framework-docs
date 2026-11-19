---
title: Получить языковой файл фразы Loc::getMessageSourceFile
description: Метод Loc::getMessageSourceFile возвращает путь языкового файла, из которого класс Loc загрузил фразу. Путь известен, только пока задан обработчик фраз.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::getMessageSourceFile` возвращает путь языкового файла, из которого класс `Loc` загрузил фразу. Путь нужен, например, чтобы найти файл с переводом, который надо исправить.

Метод появился в версии `main` новее 26.150.0.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function getMessageSourceFile(string $code, ?string $language = null): ?string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `string` | Задает код фразы |
| language | `string`, `null` | Задает код языка. По умолчанию — `null`, тогда метод берет язык из [getCurrentLang](get-current-lang.md) |

## Возвращаемое значение

Метод возвращает полный путь языкового файла или `null`. Метод возвращает `null`, если фраза еще не загружена или класс загрузил ее без обработчика фраз.

## Особенности

- Класс запоминает файлы фраз, только пока задан обработчик из [setMessageDecorator](set-message-decorator.md). Задайте обработчик до загрузки фраз, иначе метод вернет `null`.
- Метод не загружает фразы сам. Сначала получите фразу через [getMessage](get-message.md) или загрузите файл через [loadLanguageFile](load-language-file.md).
- Класс загружает сначала файл языка по умолчанию, затем файл запрошенного языка. Если существуют оба файла, метод возвращает путь файла запрошенного языка для всех фраз. Это верно и для фразы, которая есть только в файле языка по умолчанию.
- Для фразы, которую заменил [loadCustomMessages](load-custom-messages.md), метод возвращает исходный языковой файл, а не файл замены.

## Примеры

**Пример.** Код задает обработчик фраз, получает фразу установщика модуля `main` и проверяет путь ее языкового файла. Блок `finally` отключает обработчик:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loc::setMessageDecorator(
    static function (string $code, ?string $raw, ?string $message, ?string $file, string $language): ?string
    {
        return $message;
    }
);

try
{
    Loc::loadMessages($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php');
    Loc::getMessage('MAIN_EVERYONE_GROUP_NAME', null, 'en');

    $file = Loc::getMessageSourceFile('MAIN_EVERYONE_GROUP_NAME', 'en');
    echo str_ends_with((string)$file, '/main/lang/en/install/index.php') ? 'Found' : 'Not found';
}
finally
{
    Loc::setMessageDecorator(null);
}
```

Код выведет `Found`.

## Смотрите также

- [Loc::setMessageDecorator](set-message-decorator.md)
- [Loc::getIncludedFiles](get-included-files.md)
