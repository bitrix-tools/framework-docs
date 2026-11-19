---
title: Получить язык по умолчанию Loc::getDefaultLang
description: Метод Loc::getDefaultLang возвращает язык, фразы которого Loc загружает, если для языка нет перевода.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::getDefaultLang` возвращает язык по умолчанию для языка. Когда класс `Loc` загружает языковой файл, он сначала берет фразы языка по умолчанию, а затем заменяет их фразами запрошенного языка. Поэтому код получает фразу без перевода на языке по умолчанию.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function getDefaultLang($lang)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| lang\* | `string` | Задает код языка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает код языка:

- `ru` для `ru`, `kz`, `by` и `uz`,
- `en` для `en`, `ua` и `de`,
- значение из секции `default_language` конфигурации ядра для других языков, если там задан этот язык,
- `en` в остальных случаях.

## Примеры

**Пример.** Код выводит языки по умолчанию для трех языков:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

foreach (['kz', 'de', 'pl'] as $lang)
{
    echo $lang . ' — ' . Loc::getDefaultLang($lang) . PHP_EOL;
}
```

Если в конфигурации нет секции `default_language` с языком `pl`, код выведет `ru`, `en` и `en`.

## Смотрите также

- [Loc::loadLanguageFile](load-language-file.md)
- [Конфигурация ядра](../../../../framework/settings.md)
