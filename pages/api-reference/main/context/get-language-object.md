---
title: Получить объект языка Context::getLanguageObject
description: Метод Context::getLanguageObject возвращает объект ORM языка текущего запроса с названием, кодом региональных настроек и другими полями.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getLanguageObject` возвращает объект ORM языка текущего запроса. Через объект код читает поля языка без отдельного запроса к `LanguageTable`.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getLanguageObject(): ?Localization\EO_Language
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Localization\EO_Language` или `null`, если язык не задан. Методы вида `get` и имя поля возвращают поля объекта, например `getLid` возвращает идентификатор, `getName` — название языка из его настроек.

## Примеры

**Пример.** Код выводит идентификатор и название языка:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$language = Context::getCurrent()->getLanguageObject();

echo $language ? $language->getLid() . ' ' . $language->getName() : 'No language';
```

Для русского языка с названием `Russian` код выведет `ru Russian`.

## Смотрите также

- [Context::getLanguage](get-language.md)
- [Context::setLanguage](set-language.md)
