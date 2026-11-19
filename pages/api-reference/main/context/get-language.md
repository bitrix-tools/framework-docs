---
title: Получить идентификатор языка Context::getLanguage
description: Метод Context::getLanguage возвращает идентификатор языка текущего запроса, например ru или en.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getLanguage` возвращает идентификатор языка текущего запроса, например `ru` или `en`. Аналог в классическом API — константа `LANGUAGE_ID`.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getLanguage()
```

## Возвращаемое значение

Метод возвращает строку или `null`, если язык не задан.

В публичной части ядро берет язык из настроек сайта или из константы `LANGUAGE_ID`, если ее задали до подключения ядра.

В административном разделе ядро берет активный язык из параметра `lang` запроса, а без него — из параметра `admin_lid` главного модуля. Если такого активного языка нет, ядро берет язык по умолчанию. Константу `LANGUAGE_ID`, заданную до подключения ядра, ядро в административном разделе не учитывает, и она может отличаться от результата метода.

Класс [Loc](../localization/loc/index.md) берет язык сообщений из контекста при первом обращении и дальше не перечитывает его.

## Примеры

**Пример.** Код выбирает подпись по языку запроса:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$titles = ['ru' => 'Единицы измерения', 'en' => 'Units'];
$language = Context::getCurrent()->getLanguage();

echo $titles[$language] ?? $titles['en'];
```

На сайте с русским языком код выведет `Единицы измерения`.

## Смотрите также

- [Context::getLanguageObject](get-language-object.md)
- [Context::setLanguage](set-language.md)
- [Loc](../localization/loc/index.md)
