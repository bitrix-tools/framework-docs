---
title: Заменить эмодзи своей функцией Emoji::replace
description: Метод Emoji::replace заменяет четырехбайтовые символы UTF-8 результатом переданной функции.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Emoji::replace` находит четырехбайтовые символы UTF-8 и заменяет каждый результатом переданной функции. Метод [encode](encode.md) использует его со своей функцией.

Сигнатура метода в классе `Bitrix\Main\Text\Emoji`:

```php
public static function replace($text, $callback)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| text\* | `string` | Задает текст |
| callback\* | `callable` | Задает функцию замены. Функция получает массив совпадения, символ — в элементе `0`, и возвращает строку замены |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` или `null` при ошибке регулярного выражения. Метод передает результат `preg_replace_callback` без изменений.

## Примеры

**Пример.** Код удаляет эмодзи из текста:

```php
<?php
use Bitrix\Main\Text\Emoji;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Emoji::replace("Готово \u{1F600}!", static fn(array $match): string => '');
```

## Смотрите также

- [Emoji::encode](encode.md)
