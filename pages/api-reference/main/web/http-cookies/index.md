---
title: HttpCookies — коллекция cookie HTTP-клиента
description: Класс Bitrix\Main\Web\HttpCookies хранит cookie как объекты Http\Cookie, разбирает заголовки Set-Cookie и собирает заголовок Cookie.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Web`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `HttpCookies` хранит cookie для запросов `HttpClient`. Каждый элемент коллекции — объект `Bitrix\Main\Web\Http\Cookie` с именем и значением.

Методы `HttpClient::getCookies` и `HttpHeaders::getCookies` возвращают коллекцию cookie ответа. Метод `HttpHeaders::getCookies` разбирает заголовки `Set-Cookie` методом [addFromString](add-from-string.md), а `HttpClient::getCookies` вызывает `HttpHeaders::getCookies` для заголовков ответа. Метод `HttpClient::setCookies` собирает заголовок `Cookie` запроса методом [implode](implode.md).

Чтобы установить cookie посетителю сайта, используйте способ из статьи [Cookies](../../../../framework/cookies.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [implode](implode.md) | Собирает cookie в строку для заголовка `Cookie` | |
| [addFromString](add-from-string.md) | Добавляет cookie из значения заголовка `Set-Cookie` | |

## Наследование

Класс наследует `Bitrix\Main\Type\Dictionary`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct(?array $values = null)` | Строковое значение превращает в объект `Http\Cookie`, ключ массива становится именем cookie. Объекты `Http\Cookie` добавляет как есть |
| `toArray` | Возвращает массив «имя cookie — значение», а не объекты `Http\Cookie`. Ключи берет из имен cookie |
| `offsetSet` | Запись `$cookies[$name] = $cookie` принимает только объект `Http\Cookie`. Для другого значения выбрасывает `Bitrix\Main\ArgumentTypeException` |

### Унаследованные методы

Методы `get`, `set`, `getValues`, `setValues`, `clear`, `isEmpty`, `count`, `jsonSerialize` и обход в `foreach` работают как в классе `Bitrix\Main\Type\Dictionary`. Методы `get` и `getValues` возвращают объекты `Http\Cookie`. Метод `set` с ключом проверяет тип через `offsetSet`. Методы `set` с массивом и `setValues` заменяют содержимое без проверки типа.

## Смотрите также

- [Cookies](../../../../framework/cookies.md)
