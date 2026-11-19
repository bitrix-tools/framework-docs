---
title: Получить текущий язык Loc::getCurrentLang
description: Метод Loc::getCurrentLang возвращает код текущего языка из контекста запроса или en.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::getCurrentLang` возвращает код текущего языка. Метод [getMessage](get-message.md) и другие методы класса используют этот язык, если код не передал язык в аргументе.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function getCurrentLang()
```

## Возвращаемое значение

Метод возвращает код языка, например `ru` или `en`.

При первом вызове метод берет язык из контекста `Context::getCurrent()->getLanguage()` и запоминает его. Если контекста или языка в нем нет, метод возвращает `en` и не запоминает его, поэтому следующий вызов снова проверит контекст. Если язык задан методом [setCurrentLang](set-current-lang.md), метод возвращает его без проверки контекста.

## Примеры

**Пример.** Код выводит текущий язык:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Loc::getCurrentLang();
```

## Смотрите также

- [Loc::setCurrentLang](set-current-lang.md)
