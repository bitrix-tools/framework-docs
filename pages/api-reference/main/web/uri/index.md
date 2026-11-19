---
title: Uri — разбор и сборка адреса
description: Класс Bitrix\Main\Web\Uri разбирает адрес на части, меняет параметры запроса, хост и путь и собирает адрес обратно.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Web`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Uri` разбирает адрес на части — схему, хост, порт, путь, строку запроса и фрагмент — и собирает его обратно. Класс нужен, чтобы добавить или удалить параметры запроса, сменить хост или путь, сделать адрес абсолютным.

Класс реализует интерфейсы PSR-7 `Psr\Http\Message\UriInterface` и `JsonSerializable`. Объект можно привести к строке, например `(string)$uri`.

Методы работают с объектом двумя способами.

- Методы `set*`, [addParams](add-params.md), [deleteParams](delete-params.md), [toAbsolute](to-absolute.md) и [resolveRelativeUri](resolve-relative-uri.md) меняют сам объект и возвращают его.
- Методы `with*` из PSR-7 не меняют объект и возвращают измененную копию.

Методы `addParams` и `clearParams` класса [PageNavigation](../../ui/page-navigation/index.md) принимают и возвращают объект `Uri`. PSR-7-запрос `Bitrix\Main\Web\Http\Request` хранит адрес как `UriInterface`. Методы `HttpClient`, например `get` и `post`, принимают адрес строкой, объект `Uri` PHP приведет к строке.

{% note warning "" %}

Метод `getUrl` устарел. Он возвращает то же, что [getLocator](get-locator.md). Для нового кода используйте [getLocator](get-locator.md) или [getUri](get-uri.md).

{% endnote %}

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает объект из строки адреса | |
| [getUri](get-uri.md) | Возвращает адрес целиком | 15.5.10 |
| [getLocator](get-locator.md) | Возвращает адрес без фрагмента | 15.5.10 |
| [getPathQuery](get-path-query.md) | Возвращает путь со строкой запроса | 14.0.15 |
| [getScheme](get-scheme.md) | Возвращает схему | 14.0.15 |
| [getHost](get-host.md) | Возвращает хост | 14.0.15 |
| [setHost](set-host.md) | Задает хост | 14.0.15 |
| [getPort](get-port.md) | Возвращает порт | 14.0.15 |
| [getUser](get-user.md) | Возвращает имя пользователя | 14.0.15 |
| [setUser](set-user.md) | Задает имя пользователя | 16.5.7 |
| [getPass](get-pass.md) | Возвращает пароль | 14.0.15 |
| [setPass](set-pass.md) | Задает пароль | 16.5.7 |
| [getUserInfo](get-user-info.md) | Возвращает имя пользователя и пароль | |
| [getAuthority](get-authority.md) | Возвращает учетные данные, хост и порт | |
| [getPath](get-path.md) | Возвращает путь | 14.0.15 |
| [setPath](set-path.md) | Задает путь | 15.5.10 |
| [getQuery](get-query.md) | Возвращает строку запроса | 14.0.15 |
| [addParams](add-params.md) | Добавляет или заменяет параметры запроса | 15.5.10 |
| [deleteParams](delete-params.md) | Удаляет параметры запроса | 15.5.10 |
| [getFragment](get-fragment.md) | Возвращает фрагмент | 14.0.15 |
| [toAbsolute](to-absolute.md) | Делает адрес абсолютным по хосту | |
| [resolveRelativeUri](resolve-relative-uri.md) | Дополняет относительный адрес частями базового адреса | |
| [isPathTraversal](is-path-traversal.md) | Проверяет, есть ли в пути переход `..` | |
| [convertToPunycode](convert-to-punycode.md) | Переводит хост в Punycode | |
| [convertToUnicode](convert-to-unicode.md) | Переводит хост из Punycode в Unicode | |
| [urnEncode](urn-encode.md) | Кодирует части строки адреса без разбора | |
| [urnDecode](urn-decode.md) | Раскодирует части строки адреса без разбора | |
| [jsonSerialize](json-serialize.md) | Возвращает адрес для `json_encode` | |
| [withScheme](with-scheme.md) | Возвращает копию с другой схемой | |
| [withUserInfo](with-user-info.md) | Возвращает копию с другими учетными данными | |
| [withHost](with-host.md) | Возвращает копию с другим хостом | |
| [withPort](with-port.md) | Возвращает копию с другим портом | |
| [withPath](with-path.md) | Возвращает копию с другим путем | |
| [withQuery](with-query.md) | Возвращает копию с другой строкой запроса | |
| [withFragment](with-fragment.md) | Возвращает копию с другим фрагментом | |

## Смотрите также

- [HTTP-клиент](../../../../advanced/http-client.md)
- [PageNavigation](../../ui/page-navigation/index.md)
