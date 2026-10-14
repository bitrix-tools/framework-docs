---
title: Объект приложения и контекст
description: 'Объект приложения и контекст. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

В Bitrix Framework объект приложения предоставляет доступ к ядру, а контекст — к данным текущего запроса. Примеры ниже выполняйте после подключения пролога, который инициализирует ядро.

## Объект приложения

Приложение в Bitrix Framework инициализирует ядро и служит точкой входа. Через объект приложения можно получить соединение с базой данных и управляемый кэш.

-  **Наследование**. Каждое приложение наследует [`Bitrix\Main\Application`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Application.html). Например, [`Bitrix\Main\HttpApplication`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-HttpApplication.html) обрабатывает HTTP-запросы.

-  **Singleton**. Приложение реализует шаблон Singleton, то есть создает только один экземпляр объекта в рамках одного запроса. Получить его можно так:

```php
use Bitrix\Main\Application;

$application = Application::getInstance();
```

## Контекст

**Контекст** связан с текущим запросом и содержит объект запроса, ответ и серверные параметры.

-  **Наследование**. Базовый класс контекста — [`Bitrix\Main\Context`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Context.html). Класс `Bitrix\Main\HttpContext` наследует его для работы с HTTP-запросами.

-  **Получение контекста**. Чтобы получить контекст текущего хита, используйте:

```php
use Bitrix\Main\Application;

$context = Application::getInstance()->getContext();
```

Если приложение — `Bitrix\Main\HttpApplication`, вызов вернет `Bitrix\Main\HttpContext`.

### Сервер, сайт и язык

Контекст предоставляет данные окружения текущего запроса.

-  `getServer()` — возвращает объект `Bitrix\Main\Server` с серверными параметрами. Например, метод `getDocumentRoot()` этого объекта возвращает путь к корневому каталогу сайта.

-  `getSite()` — возвращает строковый идентификатор текущего сайта или `null`, если сайт в контексте не задан.

-  `getLanguage()` — возвращает строковый идентификатор текущего языка или `null`, если язык в контексте не задан.

Чтобы получить серверные параметры и идентификаторы сайта и языка, используйте:

```php
use Bitrix\Main\Application;

$context = Application::getInstance()->getContext();
$server = $context->getServer();
$documentRoot = $server->getDocumentRoot();
$siteId = $context->getSite();
$languageId = $context->getLanguage();
```

## Запрос

Контекст включает в себя [запрос](./request-response.md), который содержит переданные параметры и информацию о методе запроса.

-  **Получение запроса**. Чтобы получить запрос, выполните:

```php
use Bitrix\Main\Application;

$context = Application::getInstance()->getContext();
$request = $context->getRequest();
```

-  **Класс запроса**. Запрос — экземпляр класса, наследующего [`Bitrix\Main\Request`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Request.html). Для HTTP-запросов это [`Bitrix\Main\HttpRequest`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-HttpRequest.html), который предоставляет доступ к параметрам.

## Доступ к параметрам

Метод `get()` возвращает параметр из объединенных GET- и POST-данных. При совпадении имен используется значение из POST. Чтобы получить параметр `some_name`, используйте:

```php
use Bitrix\Main\Application;

$request = Application::getInstance()->getContext()->getRequest();
$value = $request->get('some_name');
```

{% note info "" %}

Метод `get()` может вернуть строку, массив или `null`, если параметр отсутствует. Полученное значение не экранировано для HTML. Перед выводом проверьте тип и экранируйте строку через `HtmlFilter::encode()`.

{% endnote %}

Чтобы вывести строковое значение параметра в HTML, используйте:

```php
use Bitrix\Main\Application;
use Bitrix\Main\Text\HtmlFilter;

$request = Application::getInstance()->getContext()->getRequest();
$value = $request->get('some_name');

if (is_string($value))
{
    echo HtmlFilter::encode($value);
}
```
