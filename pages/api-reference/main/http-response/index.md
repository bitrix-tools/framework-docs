---
title: HttpResponse — HTTP-ответ
description: Класс Bitrix\Main\HttpResponse хранит статус, заголовки, cookie и тело HTTP-ответа и отправляет их клиенту.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `HttpResponse` хранит статус, заголовки, cookie и тело HTTP-ответа. Метод `Context::getCurrent()->getResponse()` возвращает ответ текущего запроса. Действие контроллера может вернуть свой объект ответа, например `Json` или `Redirect` из раздела «Реализации» ниже.

Основные методы ответа:

- [addHeader](add-header.md) — добавляет заголовок,
- [addCookie](add-cookie.md) — добавляет cookie,
- [setStatus](set-status.md) — задает статус.

Методы базового класса `Response` задают тело ответа.

В классическом API cookie задает метод `$APPLICATION->set_cookie`.

Подробнее — в статьях [Запрос и ответ](../../../framework/request-response.md) и [Cookie](../../../framework/cookies.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [addHeader](add-header.md) | Добавляет заголовок | |
| [setHeaders](set-headers.md) | Заменяет коллекцию заголовков | |
| [getHeaders](get-headers.md) | Возвращает коллекцию заголовков | |
| [addCookie](add-cookie.md) | Добавляет cookie | |
| [allowPersistentCookies](allow-persistent-cookies.md) | Запоминает выбор пользователя о постоянных cookie | |
| [getCookies](get-cookies.md) | Возвращает cookie ответа | |
| [setStatus](set-status.md) | Задает статус ответа | |
| [getStatus](get-status.md) | Возвращает код статуса | |
| [setLastModified](set-last-modified.md) | Задает время для заголовка `Last-Modified` | 17.5.10 |
| [writeHeaders](write-headers.md) | Отправляет статус, заголовки и cookie | |
| [redirectTo](redirect-to.md) | Создает ответ-перенаправление с заголовками, cookie и статусом текущего ответа | |
| [copyHeadersTo](copy-headers-to.md) | Копирует заголовки, cookie и статус в другой ответ | |

## Наследование

Класс наследует абстрактный класс `Bitrix\Main\Response`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct()` | Создает пустую коллекцию заголовков `Bitrix\Main\Web\HttpHeaders` |
| `flush($text = '')` | Очищает все буферы вывода, отправляет статус, заголовки, cookie и текст. Если в PHP есть функция `fastcgi_finish_request`, вызывает ее, и дальнейший вывод скрипта клиент не получает. Без этой функции добавляет заголовок `Content-Length` |

### Унаследованные методы

| Метод | Описание |
| --- | --- |
| `setContent($content)` | Задает тело ответа. Принимает строку, число, `null` или объект с методом `__toString`. Для другого значения выбрасывает `Bitrix\Main\ArgumentTypeException` |
| `appendContent($content)` | Добавляет текст в конец тела ответа. Принимает строку, число, `null` или объект с методом `__toString` |
| `getContent()` | Возвращает тело ответа |
| `send()` | Передает тело ответа в метод `flush` |
| `clear()` | Ничего не делает |

### Реализации

Классы ответов из пространства имен `Bitrix\Main\Engine\Response` наследуют `HttpResponse`.

| Класс | Назначение |
| --- | --- |
| `Json` | Возвращает данные в формате JSON |
| `AjaxJson`, `HtmlContent`, `Component` | Возвращают JSON со статусом, данными и ошибками для AJAX-вызовов |
| `Redirect` | Перенаправляет на другой адрес |
| `File`, `BFile`, `ResizedImage` | Отдают файл или изображение |
| `Zip\Archive` | Отдает ZIP-архив |
| `Render\Base` и наследники | Отрисовывают представление, компонент или расширение |
| `OpenDesktopApp`, `OpenMobileApp` | Перенаправляют по адресу десктопного или мобильного приложения |

## Смотрите также

- [Запрос и ответ](../../../framework/request-response.md)
- [Cookie](../../../framework/cookies.md)
- [Контроллеры](../../../framework/controllers.md)
