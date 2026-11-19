---
title: HttpHeaders — коллекция HTTP-заголовков
description: Класс Bitrix\Main\Web\HttpHeaders хранит HTTP-заголовки, статус и версию протокола, разбирает Content-Type, Content-Disposition и Set-Cookie.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Web`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

## Когда использовать

Класс `HttpHeaders` хранит заголовки HTTP-запроса или ответа. Объект `HttpResponse` хранит в нем заголовки и статус ответа сайта, а `HttpClient` — заголовки запроса и ответа внешнего сервера.

Класс решает три задачи.

- Методы [add](add.md), [set](set.md), [get](get.md), [has](has.md) и [delete](delete.md) работают с заголовками. Имена заголовков не зависят от регистра. У одного заголовка может быть несколько значений.
- Методы [getContentType](get-content-type.md), [getCharset](get-charset.md), [getFilename](get-filename.md) и [getCookies](get-cookies.md) разбирают значения стандартных заголовков.
- Методы [createFromString](create-from-string.md), [getStatus](get-status.md) и [getVersion](get-version.md) работают с текстом ответа и строкой статуса.

Объект можно перебрать в `foreach`. Ключ — имя заголовка, значение — массив значений.

Подробнее — в статье [Request и Response](../../../../framework/request-response.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает коллекцию заголовков | |
| [add](add.md) | Добавляет значение заголовка | |
| [set](set.md) | Заменяет значение заголовка | |
| [get](get.md) | Возвращает значение заголовка | |
| [has](has.md) | Проверяет, есть ли заголовок | |
| [delete](delete.md) | Удаляет заголовок | |
| [clear](clear.md) | Удаляет все заголовки | |
| [toString](to-string.md) | Возвращает заголовки строкой в формате HTTP | |
| [toArray](to-array.md) | Возвращает внутренний массив заголовков | |
| [getHeaders](get-headers.md) | Возвращает заголовки массивом «имя — значения» | |
| [getIterator](get-iterator.md) | Возвращает итератор для `foreach` | |
| [getContentType](get-content-type.md) | Возвращает тип содержимого из `Content-Type` | |
| [getContentTypeAttribute](get-content-type-attribute.md) | Возвращает атрибут из `Content-Type` | |
| [getCharset](get-charset.md) | Возвращает кодировку из `Content-Type` | |
| [getBoundary](get-boundary.md) | Возвращает разделитель частей из `Content-Type` | |
| [getContentDisposition](get-content-disposition.md) | Возвращает тип из `Content-Disposition` | |
| [getFilename](get-filename.md) | Возвращает имя файла из `Content-Disposition` | |
| [getCookies](get-cookies.md) | Возвращает cookie из заголовков `Set-Cookie` | |
| [createFromString](create-from-string.md) | Создает коллекцию из текста заголовков ответа со строкой статуса | |
| [parseStatus](parse-status.md) | Читает версию и статус из строки статуса | |
| [setStatus](set-status.md) | Задает код и текст статуса | |
| [getStatus](get-status.md) | Возвращает код статуса | |
| [getReasonPhrase](get-reason-phrase.md) | Возвращает текст статуса | |
| [setVersion](set-version.md) | Задает версию HTTP | |
| [getVersion](get-version.md) | Возвращает версию HTTP | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `DEFAULT_HTTP_STATUS` | `0` | Статус, который возвращает [getStatus](get-status.md), если статус не задан |

## Смотрите также

- [Request и Response](../../../../framework/request-response.md)
- [HttpResponse](../../http-response/index.md)
- [HttpCookies](../http-cookies/index.md)
