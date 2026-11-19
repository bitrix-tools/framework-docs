---
title: Удалить заголовок HttpHeaders::delete
description: Метод HttpHeaders::delete удаляет заголовок со всеми его значениями.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::delete` удаляет заголовок со всеми значениями. Имя не зависит от регистра.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function delete($name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя заголовка. Если заголовка нет, метод ничего не делает |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код удаляет заголовок и проверяет, что его больше нет:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['X-Units' => ['kg', 'g']]);
$headers->delete('x-units');

var_dump($headers->has('X-Units'));
```

Код выведет `bool(false)`.

## Смотрите также

- [HttpHeaders::clear](clear.md)
- [HttpHeaders::set](set.md)
