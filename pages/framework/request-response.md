---
title: Request и Response
description: 'Request и Response. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

## Запрос (Request)

Request — это абстрактный класс, который предоставляет информацию о текущем запросе. Он позволяет узнать метод и протокол, запрошенный URL, переданные параметры и другие данные. Класс расширяет [\Bitrix\Main\Type\ParameterDictionary](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Type-ParameterDictionary.html).

Класс обращается к пространствам имен:

-  [\Main\Type](https://docs.1c-bitrix.ru/api/namespaces/bitrix-main-type.html) — работает с типами данных,

-  [\Main\IO](https://docs.1c-bitrix.ru/api/namespaces/bitrix-main-io.html) — работает с файлами,

-  [\Main\Text](https://docs.1c-bitrix.ru/api/namespaces/bitrix-main-text.html) — работает с текстом.

Пример использования:

```php
use Bitrix\Main\Application;
use Bitrix\Main\Context;

$context = Application::getInstance()->getContext();
$request = $context->getRequest();

// Или более кратко:
$request = Context::getCurrent()->getRequest();
```

### Параметры запроса

-  Получить параметр GET или POST

    ```php
    $value = $request->get("param");
    $value = $request["param"];
    ```

-  Получить GET-параметры

    ```php
    $value = $request->getQuery("param"); // получить параметр param
    $values = $request->getQueryList(); // получить список всех параметров
    ```

-  Получить POST-параметры

    ```php
    $value = $request->getPost("param"); // получить параметр param
    $values = $request->getPostList(); // получить список всех параметров
    ```

-  Получить загруженный файл

    ```php
    $value = $request->getFile("param"); // получить файл param
    $values = $request->getFileList(); // получить список всех загруженных файлов
    ```

-  Получить значение cookie

    ```php
    $value = $request->getCookie("param"); // получить cookie param
    $values = $request->getCookieList(); // получить список всех cookies
    ```

### Данные о запросе

-  Получить метод запроса

    ```php
    $method = $request->getRequestMethod();
    ```

-  Проверить тип запроса

    ```php
    $flag = $request->isGet(); // вернет true, если GET-запрос
    $flag = $request->isPost(); // вернет true, если POST-запрос
    $flag = $request->isAjaxRequest(); // вернет true, если AJAX-запрос
    $flag = $request->isHttps(); // вернет true, если HTTPS-запрос
    ```

### Данные о запрошенной странице

-  Проверить нахождение в административном разделе

    ```php
    $flag = $request->isAdminSection(); // вернет true, если находимся в административном разделе
    ```

-  Получить запрошенный адрес

    ```php
    $requestUri = $request->getRequestUri(); // например, "/catalog/category/?param=value"
    ```

-  Получить запрошенную страницу

    ```php
    $requestPage = $request->getRequestedPage(); // например, "/catalog/category/index.php"
    ```

-  Получить директорию запрошенной страницы

    ```php
    $rDir = $request->getRequestedPageDirectory(); // например, "/catalog/category"
    ```

### Класс HttpRequest

HttpRequest — это класс, который управляет объектом Request. Он содержит информацию о текущем запросе, включая его тип и параметры. Этот класс помогает избежать использования глобальных переменных, которые применялись в старом ядре.

Создавать объект HttpRequest вручную не требуется. Его можно получить через приложение и контекст:

```php
use Bitrix\Main\Application;

$request = Application::getInstance()->getContext()->getRequest();
$name = $request->getPost("name");
$email = htmlspecialchars($request->getQuery("email"));
```

## Ответ (Response)

Класс \Bitrix\Main\HttpResponse — это базовый класс для работы с HTTP-ответами. Он служит контейнером для:

**HTTP-заголовков** [`\Bitrix\Main\Web\HttpHeaders`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Web-HttpHeaders.html)

-  Добавить заголовок

    ```php
    \Bitrix\Main\HttpResponse::addHeader(
        $name,
        $value
    )
    ```

-  Установить заголовок

    ```php
    \Bitrix\Main\HttpResponse::setHeaders(
        Web\HttpHeaders $headers
    )
    ```

-  Получить заголовок

    ```php
    \Bitrix\Main\HttpResponse::getHeaders()
    ```

**Cookies** [`\Bitrix\Main\Web\Cookie`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Web-Cookie.html)

-  Добавить cookie

    ```php
    \Bitrix\Main\HttpResponse::addCookie(
        Web\Cookie $cookie,
        $replace,
        $checkExpires
    )
    ```

-  Получить cookies

    ```php
    \Bitrix\Main\HttpResponse::getCookies()
    ```

**Контента** `\Bitrix\Main\HttpResponse::$content`

-  Установить контент

    ```php
    \Bitrix\Main\HttpResponse::setContent(
        $content
    )
    ```

-  Получить контент

    ```php
    \Bitrix\Main\HttpResponse::getContent()
    ```

С помощью HttpResponse можно формировать ответы приложения любого типа и содержания.

```php
$response = new \Bitrix\Main\HttpResponse();
$response->addHeader('Content-Type', 'text/plain'); // добавить заголовок
$response->addCookie(new \Bitrix\Main\Web\Cookie('Biscuits', 'Yubileynoye')); // добавить cookie
$response->setContent('Hello, world!'); // установить контент
```

### Стандартные форматы ответов

-  [AjaxJson](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-AjaxJson.html) — методы для JSON-ответов. Все ответы от контроллеров `\Bitrix\Main\Engine\Controller` имеют структуру, понятную для JS API [BX.ajax.runAction](https://dev.1c-bitrix.ru/api_help/js_lib/ajax/bx_ajax_runaction.php), [BX.ajax.runComponentAction](https://dev.1c-bitrix.ru/api_help/js_lib/ajax/bx_ajax_runcomponentaction.php).

    ```json
    {
        "status": "string",
        "data": "mixed",
        "errors": []
    }
    ```

-  [Json](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Json.html) — формирует JSON-ответ. Преобразует данные в JSON, конвертирует в UTF-8 и устанавливает заголовок `application/json; charset=UTF-8`.

    ```php
    new \Bitrix\Main\Engine\Response\Json('ping-pong');
    /**
     Content-Type: application/json; charset=UTF-8
    "ping-pong"
    **/
    
    new \Bitrix\Main\Engine\Response\Json([
        'id' => 2208,
        'type' => 'license',
    ]);
    /**
     Content-Type: application/json; charset=UTF-8
    {"id": 2208, "type": "license"}
    **/
    ```

-  [Component](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Component.html) — работает с компонентами. Для загрузки компонента через AJAX:

    ```php
    new \Bitrix\Main\Engine\Response\Component(
        'bitrix:disk.file.view',
        '',
        [
            'FILE_ID' => $fileId,
        ]
    );
    ```

   Формирует ответ для представления компонента:

    ```json
    {
        "status": string,
        "data": {
            "html": string,
                "assets": {
                    "css": array,
                    "js": array,
                    "string": array
                },
            "additionalParams": array      
        },
        "errors": array
    }
    ```

### Файлы и изображения

-  [BFile](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-BFile.html) — работает с файлами. Используется для скачивания файлов из таблицы `b_file`.

-  [ResizedImage](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-ResizedImage.html) — уменьшает изображения.

-  [Zip/Archive](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Zip-Archive.html) — работает с архивом. Для NGINX можно использовать расширение mod_zip для создания архивов без нагрузки на PHP.

   ```php
   use Bitrix\Main\Engine\Response;

   $archive = new Response\Zip\Archive('archive.zip');
   $archive->addEntry(Response\Zip\ArchiveEntry::createFromFileId($fileId));
   ```

-  [Zip/ArchiveEntry](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Zip-ArchiveEntry.html) — описывает элемент zip-архива.

### Управление ответом

Класс [Redirect](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Redirect.html) автоматически делает:

-  проверки безопасности,

-  редирект с 301 или 302 статусом.

```php
// сделать переадресацию с 302 статусом
$response = new \Bitrix\Main\Engine\Response\Redirect('/auth');   

// сделать переадресацию с 301 статусом
$response = new \Bitrix\Main\Engine\Response\Redirect('/auth');
$response->setStatus('301 Moved Permanently');
```

### Преобразование данных {#converter}

Класс [Converter](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Converter.html) конвертирует строки и массивы. Для настройки преобразований класс использует битовые маски.

| **Константа**    | **Описание**                                                          |
|------------------|-----------------------------------------------------------------------|
| `TO_SNAKE`       | Перевести в snake_case.                                               |
| `TO_SNAKE_DIGIT` | Перевести в snake_case с поддержкой цифр.                             |
| `TO_CAMEL`       | Перевести в camelCase.                                                |
| `TO_UPPER`       | Перевести в верхний регистр.                                          |
| `TO_LOWER`       | Перевести в нижний регистр.                                           |
| `LC_FIRST`       | Перевести первую букву в нижний регистр.                              |
| `UC_FIRST`       | Перевести первую букву в верхний регистр.                             |
| `KEYS`           | Применить преобразования к ключам ассоциативного массива.             |
| `VALUES`         | Применить преобразования к значениям массива.                         |
| `RECURSIVE`      | Выполнить преобразования рекурсивно для массива и вложенных массивов. |

Есть предустановленный формат `Converter::OUTPUT_JSON_FORMAT`, который использует константы: `TO_CAMEL`, `KEYS`, `RECURSIVE`.

Методы класса:

-  `__construct($format)` — создает объект с заданными преобразованиями,

-  `process($data)` — применяет преобразования к строке или массиву,

-  `getFormat(): int` — возвращает текущий формат,

-  `setFormat($format)` — устанавливает новый формат,

-  `toJson()` — создает объект с форматом `OUTPUT_JSON_FORMAT`.

```php
use Bitrix\Main\Engine\Response\Converter;

// Преобразование строки: первая буква в нижний регистр + camelCase
$converter = new Converter(Converter::LC_FIRST | Converter::TO_CAMEL);
echo $converter->process('la_la_land'); // laLaLand

// Подготовка массива для JSON-ответа
$converter = new Converter(Converter::OUTPUT_JSON_FORMAT);
$result = $converter->process([
    'CATEGORIES' => [
        ['ID' => 1, 'NAME' => 'Foods'],
        ['ID' => 12, 'NAME' => 'Auto'],
    ]
]);
/*
[
    'categories' => [
        ['id' => 1, 'name' => 'Foods'],
        ['id' => 12, 'name' => 'Auto'],
    ],
]
*/

// Комбинация преобразований
$converter = new Converter(
    Converter::TO_SNAKE_DIGIT | 
    Converter::KEYS | 
    Converter::VALUES | 
    Converter::RECURSIVE
);
$result = $converter->process([
    'property109',
    'props' => [
        'element1' => ['property210']
    ]
]);
/*
[
    'property_109',
    'props' => [
        'element_1' => ['property_210']
    ]
]
*/
```