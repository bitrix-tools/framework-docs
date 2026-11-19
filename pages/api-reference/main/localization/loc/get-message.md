---
title: Получить фразу Loc::getMessage
description: Метод Loc::getMessage возвращает языковую фразу по коду, подставляет значения шаблонов и при необходимости загружает языковой файл.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::getMessage` возвращает языковую фразу по коду. Если фразы еще нет, метод загружает языковые файлы, которые зарегистрировал [loadMessages](load-messages.md).

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function getMessage($code, $replace = null, $language = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `string` | Задает код фразы, например `MYMODULE_GREETING` |
| replace | `array`, `null` | Задает замены в тексте фразы, например `['#NUM#' => 5]`. Метод подставляет значения функцией `strtr`. По умолчанию — `null` |
| language | `string`, `null` | Задает код языка. По умолчанию — `null`, текущий язык из [getCurrentLang](get-current-lang.md) |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку с текстом фразы или `null`, если фразы нет.

Если перевода фразы на язык нет, метод возвращает фразу на языке по умолчанию из [getDefaultLang](get-default-lang.md). Если нет и ее, метод возвращает `null`.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код получает фразу с формой множественного числа и подставляет число в шаблон `#MIN#`:

  ```php
  <?php
  use Bitrix\Main\Localization\Loc;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  Loc::loadMessages($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/lib/Validation/Validator/LengthValidator.php');

  echo Loc::getMessage('MAIN_VALIDATION_LENGTH_INVALID_MIN_PLURAL_2', ['#MIN#' => 5], 'ru');
  ```

  Код выведет `Длина строки должна быть не меньше, чем 5 знаков`.

- Классический API

  Функция `GetMessage` ищет фразу в глобальном массиве `$MESS`, а если ее там нет, вызывает `Loc::getMessage` на текущем языке.

  **Пример.** Код получает ту же фразу через `GetMessage` и подставляет значение:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  IncludeModuleLangFile($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/lib/Validation/Validator/LengthValidator.php');

  echo GetMessage('MAIN_VALIDATION_LENGTH_INVALID_MIN_PLURAL_2', ['#MIN#' => 5]);
  ```

{% endlist %}

## Смотрите также

- [Loc::loadMessages](load-messages.md)
- [Loc::getMessagePlural](get-message-plural.md)
- [Loc::setMessageDecorator](set-message-decorator.md)
