---
title: Проверить длину значения LengthValidator::validate
description: Метод LengthValidator::validate проверяет длину значения в символах и возвращает true или текст ошибки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `LengthValidator::validate` проверяет длину значения. ORM вызывает метод для каждого валидатора поля перед записью.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Validators\LengthValidator`:

```php
public function validate($value, $primary, array $row, Field $field)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает проверяемое значение. Метод приводит его к строке |
| primary\* | `array`, `null` | Задает первичный ключ записи. Метод его не использует |
| row\* | `array` | Задает данные записи. Метод их не использует |
| field\* | `Bitrix\Main\ORM\Fields\Field` | Задает поле. Метод подставляет имя и заголовок поля в текст ошибки |

Типы `value` и `primary` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если длина подходит, или строку с текстом ошибки.

## Особенности

Метод считает длину функцией `mb_strlen` и сначала проверяет минимум, затем максимум. Метод пропускает без проверки значение `null` в поле, которое допускает `NULL`.

Метод берет стандартный текст ошибки из языкового файла. В тексте ошибки метод заменяет `#FIELD_NAME#`, `#FIELD_TITLE#`, `#VALUE#` и `#MIN_LENGTH#` или `#MAX_LENGTH#`.

## Примеры

**Пример.** Код проверяет слишком длинный код единицы измерения и выводит свой текст ошибки:

```php
<?php
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\ORM\Fields\Validators\LengthValidator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$validator = new LengthValidator(1, 5, ['MAX' => 'Field #FIELD_NAME# is longer than #MAX_LENGTH#']);

var_dump($validator->validate('kilogram', null, [], new StringField('CODE')));
```

Код выведет `string(27) "Field CODE is longer than 5"`.

## Смотрите также

- [LengthValidator::getMin](get-min.md)
- [LengthValidator::getMax](get-max.md)
