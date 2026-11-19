---
title: Получить HTML-код расширения Extension::getHtml
description: Метод Extension::getHtml регистрирует расширение и возвращает HTML-код тегов для подключения его файлов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::getHtml` регистрирует расширение и возвращает HTML-код, который подключает его файлы. Метод вызывает `CJSCore::GetHTML`. Метод подходит, когда HTML нужно вставить самому, например в ответ на AJAX-запрос.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function getHtml($extName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| extName\* | `string` | Задает имя расширения |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку с тегами `<script>` и `<link>` или `null`, если метод [register](register.md) не зарегистрировал расширение.

## Примеры

**Пример.** Код проверяет, что HTML-код расширения `main.loader` содержит тег `<script>`:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$html = (string)Extension::getHtml('main.loader');

var_dump(str_contains($html, '<script'));
```

## Смотрите также

- [Extension::load](load.md)
