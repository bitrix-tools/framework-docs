---
title: Получить значение заголовка HttpHeaders::get
description: Метод HttpHeaders::get возвращает первое значение заголовка или все значения массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::get` возвращает значение заголовка по имени. Имя не зависит от регистра.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function get($name, $returnArray = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя заголовка |
| returnArray | `bool` | Значение `true` возвращает все значения массивом. По умолчанию — `false`, метод возвращает первое значение |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку или массив строк. Если заголовка нет, метод возвращает `null`.

## Особенности

Некоторые заголовки встречаются в ответе несколько раз, например `Set-Cookie`. Без `returnArray` метод вернет только первое значение.

## Примеры

**Пример.** Код читает первое и все значения заголовка:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['X-Units' => ['kg', 'g']]);

var_export([$headers->get('x-units'), $headers->get('X-UNITS', true), $headers->get('X-None')]);
```

Код выведет:

```text
array (
  0 => 'kg',
  1 => 
  array (
    0 => 'kg',
    1 => 'g',
  ),
  2 => NULL,
)
```

## Смотрите также

- [HttpHeaders::has](has.md)
- [HttpHeaders::getHeaders](get-headers.md)
