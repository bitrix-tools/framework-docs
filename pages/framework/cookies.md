---
title: Cookie-файлы
description: 'Cookie-файлы. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Для работы с файлами cookie предназначен класс `Bitrix\Main\Web\Cookie`. Он позволяет создавать cookie с такими параметрами, как имя, значение, срок действия и путь.

## Как установить cookie

Чтобы задать cookie, используйте класс `Bitrix\Main\HttpResponse`.

1. Импортируйте классы `Cookie` и `Context`.

   ```php
   use Bitrix\Main\Web\Cookie;
   use Bitrix\Main\Context;
   ```

2. Создайте объект cookie. Укажите имя, значение и срок действия cookie.

   ```php
   $cookie = new Cookie("example_cookie", "cookie_value", time() + 3600); // действует 1 час
   ```

3. Настройте параметры cookie. При необходимости задайте домен, путь, флаги безопасности и доступности.

   ```php
   $cookie->setDomain("example.com");
   $cookie->setPath("/");
   $cookie->setSecure(false); // true, если нужно передавать только по HTTPS
   $cookie->setHttpOnly(true); // доступ только через HTTP
   ```

4. Добавьте cookie в ответ. Используйте объект ответа текущего контекста, чтобы добавить созданный cookie.

   ```php
   $response = Context::getCurrent()->getResponse();
   $response->addCookie($cookie);
   ```

Когда вы добавляете cookie в ответ, они отправляются клиенту и сохраняются у него. Однако сервер сможет прочитать эти файлы cookie только при следующем запросе клиента, так как текущий запрос их еще не получил.

## Как получить cookie

Чтобы получить cookie, используйте класс `Bitrix\Main\HttpRequest`.

1. Получите объект запроса. Используйте текущий контекст для доступа к запросу.

   ```php
   use Bitrix\Main\Context;
   
   $request = Context::getCurrent()->getRequest();
   ```

2. Извлеките значение cookie. Используйте метод `getCookie` объекта запроса, указав имя cookie.

   ```php
   $cookieValue = $request->getCookie("example_cookie");
   
   // Проверка наличия и вывод значения
   if ($cookieValue !== null) {
       echo "Значение cookie: " . $cookieValue;
   } else {
       echo "Cookie не найдено.";
   }
   ```

## Методы для работы с cookie

### Домен

```php
$cookie->setDomain('example.com'); // установить cookie для домена 'example.com'
$cookie->getDomain(); // получить домен, который был установлен для cookie
```

### Срок действия

```php
$cookie->setExpires(time() + 3600); // установить время истечения cookie через 1 час
$cookie->getExpires(); // получить время истечения cookie
```

### Доступность через HTTP

```php
$cookie->setHttpOnly(true); // установить доступность cookie только через HTTP-протокол
$cookie->getHttpOnly(); // получить текущее значение флага HttpOnly для объекта cookie. Флаг указывает, доступна ли cookie только через HTTP-протокол
```

### Имя

```php
$cookie->setName('session_id'); // установить имя cookie 'session_id'
$cookie->getName(); // получить имя cookie
```

### Путь

```php
$cookie->setPath('/'); // установить путь на сервере, для которого будет доступна cookie
$cookie->getPath(); // получить путь, который был установлен для cookie
```

### Передача по HTTPS

```php
$cookie->setSecure(true); // установить флаг Secure для cookie. Он указывает, что cookie передается только по HTTPS
$cookie->getSecure(); // получить текущее значение флага Secure для cookie. Метод возвращает true или false, которое указывает, передается ли cookie только по HTTPS
```

### Значение

```php
$cookie->setValue('abc123'); // установить значение abc123 для cookie
$cookie->getValue(); // получить текущее значение, хранящееся в cookie
```

### Атрибут SameSite

```php
$cookie->setSameSite('Lax'); // установить атрибут SameSite для cookie, он определяет политику отправки cookie в кросс-сайтовых запросах
$cookie->getSameSite(); // получить текущее значение атрибута SameSite для cookie
```

## Работа с cookie через AJAX

Чтобы добавить cookie через AJAX, используйте следующие примеры:

```php
use Bitrix\Main\Application;
use Bitrix\Main\Web\Cookie;

$application = Application::getInstance();
$context = $application->getContext();

$cookie = new Cookie('filter__city', 'Granada', time() + 60*60*24*60);
$cookie->setDomain($context->getServer()->getHttpHost());
$cookie->setHttpOnly(false);

$context->getResponse()->addCookie($cookie);
$context->getResponse()->flush('');
```

Файл `/local/ajax/set_cookie.php`:

```php
<?php

require $_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php";

use Bitrix\Main\Application;
use Bitrix\Main\Web\Cookie;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['ACTION'] === 'selectMyCity') {
    $APPLICATION->RestartBuffer();
    header('Content-Type: application/json');

    $response = ['STATUS' => 'ERROR', 'MESSAGE' => 'Не удалось добавить cookie'];

    if (check_bitrix_sessid()) {
        $city = $_POST['city'];

        $application = Application::getInstance();
        $context = $application->getContext();

        $cookie = new Cookie('filter__city', $city, time() + 60*60*24*30);
        $cookie->setDomain($context->getServer()->getHttpHost());
        $cookie->setHttpOnly(false);

        $context->getResponse()->addCookie($cookie);

        $response = ['STATUS' => 'SUCCESS', 'MESSAGE' => 'Cookie успешно добавлена'];
    }

    echo json_encode($response);
    Application::getInstance()->end();
}
```

Файл `set_cookie.js`:

```javascript
function setCityCookie(city) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/local/ajax/set_cookie.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatecha nge = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.STATUS === 'SUCCESS') {
                console.log("Cookie установлена успешно");
            } else {
                console.error("Ошибка установки cookie: " + response.MESSAGE);
            }
        }
    };

    const params = `ACTION=selectMyCity&city=${encodeURIComponent(city)}&sessid=${BX.bitrix_sessid()}`;
    xhr.send(params);
}
```

## Шифрованные cookie

Шифрованные cookie `\Bitrix\Main\Web\CryptoCookie` позволяют передавать данные пользователю без раскрытия их содержимого и без изменения. Доступно с версии Главного модуля 20.5.400.

### Конфигурация

Для шифрования данных ядром необходимо указать `crypto_key` в файле настроек `/bitrix/.settings.php`. В новых дистрибутивах он генерируется автоматически.

Если ключ отсутствует, добавьте его вручную:

```php
<?php
return [
    //...
    'crypto' => [
        'value' => [
            'crypto_key' => 'mysupersecretphrase',
            // рекомендуется использовать 32-символьную строку из a-z0-9
        ],
        'readonly' => true,
    ]
    //...
];
```

### Примеры

1. **Установка cookie**. Чтобы установить шифрованные cookie, создайте объект и добавьте его в нужный `Response`:

   ```php
   $cookie = new \Bitrix\Main\Web\CryptoCookie('someName', 'secret value');
   \Bitrix\Main\Context::getCurrent()->getResponse()->addCookie($cookie);
   ```

   Если значение cookie превышает допустимую длину, ядро создаст несколько cookie для хранения зашифрованного значения.

2. **Чтение сookie**. Для получения расшифрованного значения используйте стандартное API ядра:

   ```php
   $httpRequest = \Bitrix\Main\Context::getCurrent()->getRequest();
   echo $httpRequest->getCookie('someName');
   // secret value
   ```

   Ядро автоматически определяет, зашифрованы ли cookie, и дешифрует их. Если расшифровка не удалась, возвращается пустое значение.
