---
title: Loc — языковые фразы
description: Класс Bitrix\Main\Localization\Loc загружает фразы языковых файлов, возвращает фразы по коду и выбирает форму множественного числа.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Localization`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Loc` возвращает тексты интерфейса из языковых файлов. Метод [loadMessages](load-messages.md) регистрирует PHP-файл, для которого нужны фразы, метод [getMessage](get-message.md) возвращает фразу по коду. Класс финальный, все методы статические.

Класс ищет каталог `lang`, поднимаясь вверх от PHP-файла. В каталоге `lang` языковой файл лежит в подкаталоге с кодом языка. Путь языкового файла повторяет путь PHP-файла от родителя каталога `lang`. Например, для `/local/php_interface/mylib.php` русский языковой файл — `/local/php_interface/lang/ru/mylib.php`. Языковой файл содержит массив `$MESS` с фразами.

Аналог в классическом API — функции `IncludeModuleLangFile` и `GetMessage`. Функция `IncludeModuleLangFile` без второго и третьего аргументов вызывает `Loc::loadMessages`. Функция `GetMessage` вызывает `Loc::getMessage`, если фразы нет в глобальном массиве `$MESS`.

Подробнее — в разделе «Механизм языковых сообщений» статьи [Локализация](../../../../advanced/localization.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [loadMessages](load-messages.md) | Регистрирует PHP-файл для отложенной загрузки фраз | |
| [getMessage](get-message.md) | Возвращает фразу по коду | |
| [getMessagePlural](get-message-plural.md) | Возвращает фразу в форме, согласованной с числом | |
| [getPluralForm](get-plural-form.md) | Возвращает номер формы фразы для числа по правилам языка | |
| [loadLanguageFile](load-language-file.md) | Сразу загружает фразы языкового файла и возвращает их | |
| [loadCustomMessages](load-custom-messages.md) | Загружает фразы, которые заменяют фразы с теми же кодами | |
| [getCurrentLang](get-current-lang.md) | Возвращает код текущего языка | |
| [setCurrentLang](set-current-lang.md) | Задает код текущего языка | |
| [getDefaultLang](get-default-lang.md) | Возвращает язык, фразы которого класс берет, если перевода нет | |
| [getIncludedFiles](get-included-files.md) | Возвращает загруженные языковые файлы | |
| [setMessageDecorator](set-message-decorator.md) | Задает функцию, которая обрабатывает каждую фразу перед возвратом | |
| [getMessageSourceFile](get-message-source-file.md) | Возвращает языковой файл, из которого загружена фраза | |

## Смотрите также

- [LocalizableMessageInterface](../localizable-message-interface/index.md)
- [Локализация](../../../../advanced/localization.md)
