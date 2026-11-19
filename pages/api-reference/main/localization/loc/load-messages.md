---
title: Зарегистрировать файл для загрузки фраз Loc::loadMessages
description: Метод Loc::loadMessages регистрирует PHP-файл, фразы языкового файла которого Loc загрузит при первом запросе фразы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::loadMessages` регистрирует PHP-файл, для которого нужны языковые фразы. Метод не читает языковой файл сразу. Метод [getMessage](get-message.md) загрузит его, когда понадобится фраза, которой еще нет. Вызывайте метод в начале PHP-файла с аргументом `__FILE__`.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function loadMessages($file)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| file\* | `string` | Задает путь к PHP-файлу, для которого нужны фразы. Это путь к исходному файлу, а не к языковому |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Если фразы нет среди загруженных, `getMessage` сначала загружает языковой файл того PHP-файла, из которого его вызвали. Затем метод перебирает зарегистрированные файлы от последнего к первому, пока не найдет фразу.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код регистрирует языковой файл установщика модуля `main` и получает из него фразу на английском:

  ```php
  <?php
  use Bitrix\Main\Localization\Loc;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  Loc::loadMessages($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php');

  echo Loc::getMessage('MAIN_EVERYONE_GROUP_NAME', null, 'en');
  ```

  Код выведет `All users (with non-authorized users)`.

- Классический API

  Функция `IncludeModuleLangFile` без второго и третьего аргументов вызывает `Loc::loadMessages`. Функция `GetMessage` ищет фразу в глобальном массиве `$MESS`, а если ее там нет, вызывает `Loc::getMessage`.

  **Пример.** Код регистрирует тот же языковой файл через классические функции и получает фразу на текущем языке:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  IncludeModuleLangFile($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php');

  echo GetMessage('MAIN_EVERYONE_GROUP_NAME');
  ```

{% endlist %}

## Смотрите также

- [Loc::getMessage](get-message.md)
- [Loc::loadLanguageFile](load-language-file.md)
