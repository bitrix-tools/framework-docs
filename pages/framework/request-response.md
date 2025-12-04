---
title: Request и Response
description: 'Request и Response. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

## Запрос (Request)

Request -- это абстрактный класс, который предоставляет информацию о текущем запросе. Он позволяет узнать метод и протокол, запрошенный URL, переданные параметры и другие данные. Класс расширяет [\\Bitrix\\Main\\Type\\ParameterDictionary](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Type-ParameterDictionary.html).

Класс обращается к пространствам имен:

-  [\\Main\\Type](https://docs.1c-bitrix.ru/api/namespaces/bitrix-main-type.html) -- работает с типами данных,

-  [\\Main\\IO](https://docs.1c-bitrix.ru/api/namespaces/bitrix-main-io.html) -- работает с файлами,

-  [\\Main\\Text](https://docs.1c-bitrix.ru/api/namespaces/bitrix-main-text.html) -- работает с текстом.

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

HttpRequest -- это класс, который управляет объектом Request. Он содержит информацию о текущем запросе, включая его тип и параметры. Этот класс помогает избежать использования глобальных переменных, которые применялись в старом ядре.

Создавать объект HttpRequest вручную не требуется. Его можно получить через приложение и контекст:

```php
use Bitrix\Main\Application;

$request = Application::getInstance()->getContext()->getRequest();
$name = $request->getPost("name");
$email = htmlspecialchars($request->getQuery("email"));
```

## Ответ (Response)

Класс \\Bitrix\\Main\\HttpResponse -- это базовый класс для работы с HTTP-ответами. Он служит контейнером для:

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

Пример использования:

```php
$response = new \Bitrix\Main\HttpResponse();
$response->addHeader('Content-Type', 'text/plain'); // добавить заголовок
$response->addCookie(new \Bitrix\Main\Web\Cookie('Biscuits', 'Yubileynoye')); // добавить cookie
$response->setContent('Hello, world!'); // установить контент
```

### Классы

-  [**AjaxJson**](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-AjaxJson.html) -- методы для JSON-ответов. Все ответы от контроллеров \\Bitrix\\Main\\Engine\\Controller имеют структуру, понятную для JS API [BX.ajax.runAction](https://dev.1c-bitrix.ru/api_help/js_lib/ajax/bx_ajax_runaction.php), [BX.ajax.runComponentAction](https://dev.1c-bitrix.ru/api_help/js_lib/ajax/bx_ajax_runcomponentaction.php):

   ```json
   {
   	"status": "string",
   	"data": "mixed",
   	"errors": []
   }
   ```

-  [**Zip/Archive** ](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Zip-Archive.html)-- работает с архивом.

   Для NGINX можно использовать расширение mod_zip для создания архивов без нагрузки на PHP.

   ```php
   use \Bitrix\Main\Engine\Response;
   $archive = new Response\Zip\Archive('archive.zip');
   $archive->addEntry(Response\Zip\ArchiveEntry::createFromFileId($fileId));
   ```

-  [**Zip/ArchiveEntry** ](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Zip-ArchiveEntry.html)-- описывает элемент zip-архива.

-  [**BFile** ](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-BFile.html)-- работает с файлами. Используется для скачивания файлов из таблицы `b_file`.

-  [**Component** ](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Component.html)-- работает с компонентами. Для загрузки компонента через AJAX:

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

   ```php
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

-  [**Json**](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Json.html) -- формирует JSON-ответ. Преобразует данные в JSON, конвертирует в UTF-8 и устанавливает заголовок `application/json; charset=UTF-8`.

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

-  [**Redirect**](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-Redirect.html) -- выполняет редирект. Автоматически делает проверки безопасности и редирект с 301 или 302 статусом.

   ```php
   //сделать переадресацию с 302 статусом
   $response = new \Bitrix\Main\Engine\Response\Redirect('/auth');   
   
   //сделать переадресацию с 301 статусом
   $response = new \Bitrix\Main\Engine\Response\Redirect('/auth');
   $response->setStatus('301 Moved Permanently');
   ```

-  [**ResizedImage**](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Engine-Response-ResizedImage.html) -- уменьшает изображения.
