---
title: Заменить значение заголовка HttpHeaders::set
description: Метод HttpHeaders::set удаляет все прежние значения заголовка и записывает новые.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::set` заменяет значение заголовка. Метод удаляет заголовок методом [delete](delete.md) и добавляет его заново методом [add](add.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function set($name, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя заголовка |
| value\* | `string` или `string[]` | Задает значение или массив значений |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\InvalidArgumentException` | Имя или значение заголовка недопустимо. К этому моменту метод уже удалил прежнее значение |

## Особенности

Метод сохраняет имя в том регистре, в котором его передали, потому что удаляет прежний заголовок целиком.

## Примеры

**Пример.** Код заменяет несколько значений одним:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Cache-Control' => ['no-cache', 'no-store']]);
$headers->set('cache-control', 'max-age=3600');

echo $headers->toString();
```

Код выведет `cache-control: max-age=3600`.

## Смотрите также

- [HttpHeaders::add](add.md)
- [HttpHeaders::delete](delete.md)
