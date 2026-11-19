---
title: Экранировать HTML HtmlFilter::encode
description: Метод HtmlFilter::encode экранирует специальные символы HTML функцией htmlspecialchars в кодировке UTF-8.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HtmlFilter::encode` экранирует специальные символы HTML функцией `htmlspecialchars` в кодировке UTF-8. Используйте метод для каждого значения, которое код выводит в HTML. Аналог в классическом API — функция `htmlspecialcharsbx`.

Сигнатура метода в классе `Bitrix\Main\Text\HtmlFilter`:

```php
public static function encode($string, $flags = ENT_COMPAT, $doubleEncode = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| string\* | `mixed` | Задает строку. Метод приводит значение к строке, `null` дает пустую строку |
| flags | `int` | Задает флаги `htmlspecialchars`. По умолчанию — `ENT_COMPAT`. Чтобы экранировать и одинарные кавычки, передайте `ENT_QUOTES` |
| doubleEncode | `bool` | Экранирует уже экранированные последовательности, например `&amp;`, если равен `true`. По умолчанию — `true` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string`.

## Примеры

**Пример.** Код выводит строку с кавычками и тегом в атрибут и в текст ссылки:

```php
<?php
use Bitrix\Main\Text\HtmlFilter;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$title = '"Kilogram" <script>';

echo '<a title="' . HtmlFilter::encode($title) . '">' . HtmlFilter::encode($title) . '</a>';
```

Код выведет `<a title="&quot;Kilogram&quot; &lt;script&gt;">&quot;Kilogram&quot; &lt;script&gt;</a>`.

## Смотрите также

- [Защита от XSS](../../../../security/xss.md)
