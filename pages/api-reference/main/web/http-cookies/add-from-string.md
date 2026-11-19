---
title: Добавить cookie из заголовка Set-Cookie HttpCookies::addFromString
description: Метод HttpCookies::addFromString разбирает значение заголовка Set-Cookie и добавляет cookie в коллекцию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpCookies::addFromString` разбирает значение заголовка `Set-Cookie` и добавляет cookie в коллекцию. Метод `HttpHeaders::getCookies` вызывает его для каждого заголовка `Set-Cookie` ответа.

Сигнатура метода в классе `Bitrix\Main\Web\HttpCookies`:

```php
public function addFromString(string $str): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| str\* | `string` | Задает значение заголовка `Set-Cookie`, например `unit=kg; Path=/; HttpOnly` |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод берет часть строки до первой `;` и делит ее по первому `=` на имя и значение. Метод декодирует имя и значение функцией `rawurldecode`. Метод не сохраняет атрибуты после `;`, например `Path`, `Expires` и `Domain`.

Если в коллекции уже есть cookie с таким именем, метод заменяет ее.

Если в строке нет `=`, значение cookie становится пустой строкой. PHP при этом выдает предупреждение о несуществующем ключе массива.

## Примеры

**Пример.** Код добавляет cookie из заголовка и выводит ее значение:

```php
<?php
use Bitrix\Main\Web\HttpCookies;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cookies = new HttpCookies();
$cookies->addFromString('unit=kg%20net; Path=/; HttpOnly');

echo $cookies->get('unit')->getValue();
```

Код выведет `kg net`.

## Смотрите также

- [HttpCookies::implode](implode.md)
