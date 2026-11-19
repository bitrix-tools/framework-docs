---
title: Задать язык Context::setLanguage
description: Метод Context::setLanguage задает язык контекста по идентификатору или объекту EO_Language.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::setLanguage` задает язык контекста и возвращает тот же контекст. Ядро вызывает метод в начале запроса, когда определяет язык.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function setLanguage($language)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| language\* | `string` или `Bitrix\Main\Localization\EO_Language` | Задает идентификатор языка, например `en`, или объект языка. Для строки метод загружает поля языка из базы данных |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает текущий контекст.

## Особенности

- Метод не проверяет, что язык существует. Для несуществующего идентификатора [getLanguage](get-language.md) возвращает этот идентификатор, а поля объекта языка равны `null`.
- Метод меняет только контекст и не меняет константу `LANGUAGE_ID` и региональные настройки контекста.
- Класс `Loc` запоминает язык сообщений при первом обращении. Чтобы сменить язык сообщений после этого, вызовите `Loc::setCurrentLang`.

## Примеры

**Пример.** Код временно переключает язык контекста на английский и восстанавливает прежний язык, если он был задан:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$context = Context::getCurrent();
$previousLanguage = $context->getLanguageObject();

try
{
    $context->setLanguage('en');
    echo $context->getLanguage() . ' ' . $context->getLanguageObject()->getName();
}
finally
{
    if ($previousLanguage !== null)
    {
        $context->setLanguage($previousLanguage);
    }
}
```

Если на сайте есть английский язык, код выведет `en English`.

## Смотрите также

- [Context::getLanguage](get-language.md)
- [Loc](../localization/loc/index.md)
