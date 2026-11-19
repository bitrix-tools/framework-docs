---
title: Задать текущий язык Loc::setCurrentLang
description: Метод Loc::setCurrentLang задает код языка, который методы Loc используют по умолчанию до конца запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::setCurrentLang` задает текущий язык класса `Loc`. До конца запроса или до следующего вызова метода остальные методы `Loc` используют этот язык, если код не передал другой. Метод не меняет язык контекста запроса.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function setCurrentLang($language)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| language\* | `string`, `null` | Задает код языка, например `en`. Значение `null` сбрасывает язык, и [getCurrentLang](get-current-lang.md) снова берет его из контекста |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код временно переключает язык на английский, получает фразу и в блоке `finally` возвращает прежний язык:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loc::loadMessages($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php');

$previousLang = Loc::getCurrentLang();
Loc::setCurrentLang('en');
try
{
    echo Loc::getMessage('MAIN_EVERYONE_GROUP_NAME');
}
finally
{
    Loc::setCurrentLang($previousLang);
}
```

Код выведет `All users (with non-authorized users)`.

## Смотрите также

- [Loc::getCurrentLang](get-current-lang.md)
